package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

var now = time.Now().Unix()
var threshold = 0.02
var cloudObjectStorageAddress = "http://0.0.0.0:8001"
var compareAddress = "http://0.0.0.0:8002"
var screenshotAddress = "http://0.0.0.0:8003"
var configureAddress = "http://0.0.0.0:8004"
var notifyAddress = "http://0.0.0.0:8006"

// func handleWatcher(wid string, data map[string]interface{}, wg *sync.WaitGroup) {
// 	defer wg.Done()
func handleWatcher(wid string, data map[string]interface{}) {

	lastRun := int64(data["last_run"].(float64))
	frequency := int64(data["frequency"].(float64))

	if now > lastRun+frequency {
		// Get old SS, get new SS, can get both files at same time in seperate threads
		var wg2 sync.WaitGroup
		var url string
		// Retrieve from COS
		wg2.Add(1)
		COSFilePath := "files/COS" + wid + ".png"
		url = cloudObjectStorageAddress + "/files/" + wid + ".png"
		fmt.Println(wid, "fetching old", url)
		go getRequestToFile(url, COSFilePath, nil, &wg2)
		fmt.Println(wid, "done old", url)
		defer os.Remove(COSFilePath)
		// Take new SS
		wg2.Add(1)
		SSFilePath := "files/" + wid + ".png"
		url = screenshotAddress + "/screenshot"
		watcherURL := data["url"].(string)
		payload := strings.NewReader("{\n   \"url\":\"" + watcherURL + "\"\n}")
		fmt.Println(wid, "fetching new", watcherURL)
		go getRequestToFile(url, SSFilePath, payload, &wg2)
		fmt.Println(wid, "done new", watcherURL)
		defer os.Remove(SSFilePath)
		wg2.Wait()
		////////////////////////////////////////

		// Get difference, notify user if over threshold
		url = compareAddress + "/difference"
		d := getDifference(url, COSFilePath, SSFilePath)
		fmt.Println(wid, " difference: ", d)
		if d >= threshold {
			// Get bounding box photo
			DFilePath := "files/D" + wid + ".png"
			url = compareAddress + "/difference_image"
			getDifferenceImage(url, COSFilePath, SSFilePath, DFilePath)
			defer os.Remove(DFilePath)

			// Mail with boundind box photo
			url = configureAddress + "/users"
			email := data["email"].(string)
			fmt.Println(wid, "difference found, mailing", email)
			url = notifyAddress + "/notify"
			go notifyUser(url, email, watcherURL, DFilePath)

			// Upload new SS
			go uploadCOS(cloudObjectStorageAddress+"/files", SSFilePath)
		}

		url = configureAddress + "/watchers/" + wid + "?last_run=" + strconv.FormatInt(now, 10)
		updateWatcher(url)

	} else {
		fmt.Println(wid, "< frequency")
	}

	fmt.Println(wid, "thread completed")
}

func main() {

	// Check if on K8 cluster and we should be getting address from env variables for services
	_, production := os.LookupEnv("KUBERNETES_SERVICE_HOST")
	if production {
		cloudObjectStorageAddress = getProdServiceAddress("CLOUD_OBJECT_STORAGE")
		compareAddress = getProdServiceAddress("COMPARE")
		screenshotAddress = getProdServiceAddress("SCREENSHOT")
		configureAddress = getProdServiceAddress("CONFIGURE")
		notifyAddress = getProdServiceAddress("NOTIFY")
	}

	fmt.Println("--------------------------------------------------------------------------------------------------------------------")
	fmt.Println("COS service address:", cloudObjectStorageAddress)
	fmt.Println("Compare service address:", compareAddress)
	fmt.Println("Screenshot service address:", screenshotAddress)
	fmt.Println("Configure service address:", configureAddress)
	fmt.Println("Notify service address:", notifyAddress)
	fmt.Println("Start time:", now)
	fmt.Println("--------------------------------------------------------------------------------------------------------------------")

	watchers := getRequestToInterface(configureAddress + "/watchers").(map[string]interface{})

	// var wg sync.WaitGroup
	for wid, data := range watchers {
		// wg.Add(1)
		data := data.(map[string]interface{})
		handleWatcher(wid, data)
		// go handleWatcher(wid, data, &wg)
	}
	// wg.Wait()
	fmt.Println("Main thread completed")
	fmt.Println("--------------------------------------------------------------------------------------------------------------------")

}
