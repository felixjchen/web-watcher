package main

import (
	"io"
	"io/ioutil"
	"os"
	"log"
	"sync"	
	"bytes"
	"strconv"

	"mime/multipart"
	"path/filepath"

	"net/http"
	"encoding/json"
)

func getProdServiceAddress(service string) string{
	host := os.Getenv(service + "_SERVICE_HOST")
	port := os.Getenv(service + "_SERVICE_PORT")
	return "http://" + host + ":" + port
}

func getRequestToInterface(url string) interface{}{
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

func getRequestToFile(url string, filePath string, payload io.Reader, wg *sync.WaitGroup){
	defer wg.Done()
  
	// Get the data
	client := &http.Client {}
	req, err := http.NewRequest("GET", url, payload)
	if err != nil {
		log.Fatal(err)
	}
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
	if err != nil  {
		log.Fatal(err)
	} 
}

func getDifference(url string, filePath1 string, filePath2 string) float64{
	payload := &bytes.Buffer{}
	writer := multipart.NewWriter(payload)

	file, err := os.Open(filePath1)
	defer file.Close()
	part1, err := writer.CreateFormFile("file_old",filepath.Base(filePath1))
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

	client := &http.Client {}
	req, err := http.NewRequest("GET", url, payload)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	res, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	f, err := strconv.ParseFloat(string(body), 64)
	return f
}
