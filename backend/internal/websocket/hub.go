package websocket

import "github.com/gorilla/websocket"

// Hub maintains the set of active clients and broadcasts messages
type Hub struct {
	Clients    map[*Client]bool
	Broadcast  chan []byte
	Register   chan *Client
	Unregister chan *Client
}

// Client represents a WebSocket client connection
type Client struct {
	Hub  *Hub
	Conn *websocket.Conn
	Send chan []byte
}

// NewHub creates a new Hub instance
func NewHub() *Hub {
	return &Hub{
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan []byte),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
	}
}

// Run starts the hub's main loop
func (h *Hub) Run() {
	// TODO: Implement the hub run loop
	// - Handle client registration
	// - Handle client unregistration
	// - Broadcast messages to all clients
}
