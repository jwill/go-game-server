package main

import (
	"code.google.com/p/go.net/websocket"
	"fmt"
	"net/http"
	"strings"
	"text/template"
)

// Main Game Server 

var homeTemplate = template.Must(template.ParseFiles("views/index.html"))

func homeHandler(w http.ResponseWriter, req *http.Request) {
	// Serve different files based on template
	homeTemplate.Execute(w, req.Host)
}

func staticFileHandler(w http.ResponseWriter, req *http.Request) {
	url := req.URL.String()
	fileName := "static" + strings.Replace(url, "/public", "", 1)
	http.ServeFile(w, req, fileName)
	// TODO Check to see if file exists
}

func main() {
	go gamehub.Run()
	fmt.Println("Started server")
	http.HandleFunc("/", homeHandler)
	http.HandleFunc("/public/", staticFileHandler)
	http.Handle("/ws", websocket.Handler(wsHandler))
	http.ListenAndServe(":8080", nil)
}
