package main

import (
	"fmt"
	"os"
	"strings"
	"sync"
	"time"
)

var now = time.Now().Unix()
var threshold = 0.01
var cloud_object_storage_address = "http://0.0.0.0:8001"
var compare_address = "http://0.0.0.0:8002"
var screenshot_address = "http://0.0.0.0:8003"
var configure_address = "http://0.0.0.0:8004"
var notify_address = "http://0.0.0.0:8006"

func handle_watcher(wid string, data map[string]interface{}, wg *sync.WaitGroup) {
	defer wg.Done()

	last_run := int64(data["last_run"].(float64))
	frequency := int64(data["frequency"].(float64))

	if now > last_run+frequency {
		////////////////////////////////////////
		// Get old SS, get new SS, can get both files at same time in seperate threads
		var wg2 sync.WaitGroup
		var url string
		// Retrieve from COS
		wg2.Add(1)
		COSFilePath := "files/COS" + wid + ".png"
		url = cloud_object_storage_address + "/files/" + wid + ".png"
		go getRequestToFile(url, COSFilePath, nil, &wg2)
		defer os.Remove(COSFilePath)
		// Take new SS
		wg2.Add(1)
		SSFilePath := "files/" + wid + ".png"
		url = screenshot_address + "/screenshot"
		watcherUrl := data["url"].(string)
		payload := strings.NewReader("{\n   \"url\":\"" + watcherUrl + "\"\n}")
		go getRequestToFile(url, SSFilePath, payload, &wg2)
		defer os.Remove(SSFilePath)
		wg2.Wait()
		////////////////////////////////////////

		// Get difference, notify user if over threshold
		url = compare_address + "/difference"
		d := getDifference(url, COSFilePath, SSFilePath)
		if d >= threshold {
			// Get bounding box photo
			DFilePath := "files/D" + wid + ".png"
			url = compare_address + "/difference_image"
			getDifferenceImage(url, COSFilePath, SSFilePath, DFilePath)
			defer os.Remove(DFilePath)

			// Mail with boundind box photo
			url = configure_address + "/users"
			uid := data["user_id"].(string)
			email := getUserEmail(url, uid)
			fmt.Println(wid, "difference found ", d, ", mailing", email)
			url = notify_address + "/notify"
			go notifyUser(url, email, watcherUrl, DFilePath)

			// Upload new SS
			go uploadCOS(cloud_object_storage_address+"/files", SSFilePath)
		}

		url = configure_address + "/watchers/" + wid
		updateWatcher(url, now)

	} else {
		fmt.Println(wid, "< frequency")
	}

	fmt.Println(wid, "thread completed")
}

func main() {
	// Check if on K8 cluster and we should be getting address from env variables for services
	_, production := os.LookupEnv("KUBERNETES_SERVICE_HOST")
	if production {
		cloud_object_storage_address = getProdServiceAddress("CLOUD_OBJECT_STORAGE")
		compare_address = getProdServiceAddress("COMPARE")
		screenshot_address = getProdServiceAddress("SCREENSHOT")
		configure_address = getProdServiceAddress("CONFIGURE")
		notify_address = getProdServiceAddress("NOTIFY")
	}

	fmt.Println("--------------------------------------------------------------------------------------------------------------------")
	fmt.Println("COS service address:", cloud_object_storage_address)
	fmt.Println("Compare service address:", compare_address)
	fmt.Println("Screenshot service address:", screenshot_address)
	fmt.Println("Configure service address:", configure_address)
	fmt.Println("Notify service address:", notify_address)
	fmt.Println("Start time:", now)
	fmt.Println("--------------------------------------------------------------------------------------------------------------------")

	watchers := getRequestToInterface(configure_address + "/watchers").(map[string]interface{})

	var wg sync.WaitGroup
	for wid, data := range watchers {
		wg.Add(1)
		data := data.(map[string]interface{})
		go handle_watcher(wid, data, &wg)
	}
	wg.Wait()
	fmt.Println("Main thread completed")
	fmt.Println("--------------------------------------------------------------------------------------------------------------------")

}
