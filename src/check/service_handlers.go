package main

import (
	"bytes"
	"io"
	"io/ioutil"
	"log"
	"os"
	"strconv"
	"strings"
	"sync"

	"mime/multipart"
	"path/filepath"

	"encoding/json"
	"net/http"
)

// Get address in cluster
func getProdServiceAddress(service string) string {
	host := os.Getenv(service + "_SERVICE_HOST")
	port := os.Getenv(service + "_SERVICE_PORT")
	return "http://" + host + ":" + port
}

func getRequestToInterface(url string) interface{} {
	response, err := http.Get(url)
	if err != nil {
		log.Fatal(err)
	}
	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
	}
	// https://www.sohamkamani.com/blog/2017/10/18/parsing-json-in-golang/
	var i interface{}
	json.Unmarshal([]byte(body), &i)
	return i
}

// Configure Handler
func getUserEmail(url string, uid string) string {
	users := getRequestToInterface(url).(map[string]interface{})
	userData := users[uid].(map[string]interface{})
	email := userData["email"].(string)
	return email
}

func updateWatcher(url string, now int64) {
	i := int(now)
	payload := strings.NewReader("{\n   \"last_run\":" + strconv.Itoa(i) + "\n}")

	client := &http.Client{}
	req, err := http.NewRequest("PUT", url, payload)
	req.Header.Add("Content-Type", "application/json")
	res, err := client.Do(req)
	if err != nil {
		log.Fatal(res)
	}
}

// COS and SS handlers
func getRequestToFile(url string, filePath string, payload io.Reader, wg *sync.WaitGroup) {
	defer wg.Done()

	// Get the data
	client := &http.Client{}
	req, err := http.NewRequest("GET", url, payload)
	req.Header.Add("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	// Writer the body to file
	out, err := os.Create(filePath)
	defer out.Close()
	_, err = io.Copy(out, resp.Body)
	if err != nil {
		log.Fatal(err)
	}
}

// Get difference
func getDifference(url string, filePath1 string, filePath2 string) float64 {
	payload := &bytes.Buffer{}
	writer := multipart.NewWriter(payload)

	file, err := os.Open(filePath1)
	defer file.Close()
	part1, err := writer.CreateFormFile("file_old", filepath.Base(filePath1))
	_, err = io.Copy(part1, file)
	if err != nil {
		log.Fatal(err)
	}

	file, err = os.Open(filePath2)
	defer file.Close()
	part2, err := writer.CreateFormFile("file_new", filepath.Base(filePath2))
	_, err = io.Copy(part2, file)
	if err != nil {
		log.Fatal(err)
	}

	writer.Close()

	// Get difference float
	client := &http.Client{}
	req, err := http.NewRequest("GET", url, payload)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	res, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	d, err := strconv.ParseFloat(string(body), 64)

	return d
}

func getDifferenceImage(url string, filePath1 string, filePath2 string, DFilePath string) {
	payload := &bytes.Buffer{}
	writer := multipart.NewWriter(payload)

	file, err := os.Open(filePath1)
	defer file.Close()
	part1, err := writer.CreateFormFile("file_old", filepath.Base(filePath1))
	_, err = io.Copy(part1, file)
	if err != nil {
		log.Fatal(err)
	}

	file, err = os.Open(filePath2)
	defer file.Close()
	part2, err := writer.CreateFormFile("file_new", filepath.Base(filePath2))
	_, err = io.Copy(part2, file)
	if err != nil {
		log.Fatal(err)
	}

	writer.Close()

	// Get difference float
	client := &http.Client{}
	req, err := http.NewRequest("GET", url, payload)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	// Writer the body to file
	out, err := os.Create(DFilePath)
	defer out.Close()
	_, err = io.Copy(out, resp.Body)
	if err != nil {
		log.Fatal(err)
	}
}

func notifyUser(url string, email string, watcherUrl string, filePath string) {
	payload := &bytes.Buffer{}
	writer := multipart.NewWriter(payload)

	file, err := os.Open(filePath)
	defer file.Close()
	part1, err := writer.CreateFormFile("file", filepath.Base(filePath))
	_, err = io.Copy(part1, file)
	_ = writer.WriteField("url", watcherUrl)
	_ = writer.WriteField("email", email)
	err = writer.Close()
	if err != nil {
		log.Fatal(err)
	}

	client := &http.Client{}
	req, err := http.NewRequest("POST", url, payload)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	_, err = client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
}

func uploadCOS(url string, filePath string) {
	payload := &bytes.Buffer{}
	writer := multipart.NewWriter(payload)

	file, err := os.Open(filePath)
	defer file.Close()
	part, err := writer.CreateFormFile("file", filepath.Base(filePath))
	_, err = io.Copy(part, file)
	err = writer.Close()
	if err != nil {
		log.Fatal(err)
	}

	client := &http.Client{}
	req, err := http.NewRequest("POST", url, payload)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	_, err = client.Do(req)
	if err != nil {
		log.Fatal(err)
	}

}
