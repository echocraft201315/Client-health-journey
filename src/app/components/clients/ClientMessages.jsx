"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { MessageSquare, Send, User } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { useAuth } from "@/app/context/AuthContext";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { socket } from "@/socket";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { tickIcon } from "../ui/Icon";
import { unreadCount } from "@/app/store";
import { useAtom } from "jotai";

const ClientMessages = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [currentClient, setCurrentClient] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [clients, setClients] = useState([]);
  const [coach, setCoach] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [unread, setUnread] = useAtom(unreadCount);
  const [toggle, setToggle] = useState(false);
  const [unreadUsers, setUnreadUsers] = useState([]);

  const feachUnreadUsers = async () => {
    try {
      const response = await fetch("/api/message/unread");
      const data = await response.json();
      if (data.status) {
        setUnreadUsers(data.users);
      } else {
        toast.error(data.message || "Failed to fetch unread clients");
      }
    } catch (error) {
      toast.error("Unable to get unread clients");
    }
  };

  const fetchMessageHistory = async (receiver) => {
    if (!receiver) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/message/history", {
        method: "POST",
        body: JSON.stringify({ receiver }),
      });
      const data = await response.json();
      if (data.status) {
        setMessages(data.messageHistory);
      } else {
        toast.error(data.message || "Failed to fetch message history");
      }
    } catch (error) {
      toast.error("Unable to get message history");
    } finally {
      setIsLoading(false);
      setUnread(0);
      setToggle((prev) => !prev);
    }
  };
  const fetchClients = async () => {
    if (user?.role !== "coach" && user?.role !== "clinic_admin") return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/coach/client");
      const data = await response.json();
      if (data.clients) {
        setClients(data.clients);
      }
    } catch (error) {
      console.log("Failed to fetch clients", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCoachbyId = async () => {
    if (!user?.coachId) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/coach/byId", {
        method: "POST",
        body: JSON.stringify({ id: user.coachId }),
      });
      const data = await response.json();
      if (data.user) {
        setCoach(data.user);
      } else {
        toast.error("Failed to fetch coach details");
      }
    } catch (error) {
      toast.error("Failed to fetch coach details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "coach" || user?.role === "clinic_admin") {
      fetchClients();
      feachUnreadUsers();
    }
    if (user?.role === "client") {
      fetchCoachbyId();
    }
    if (socket.connected) {
      onConnect();
    }
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    fetchMessageHistory(currentClient);
    function showNotification(title, body) {
      if (Notification.permission === "granted" && !document.hasFocus()) {
        const notification = new Notification(title, {
          body,
          icon: "/chat-icon.png", // Replace with your icon path in /public
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    }
    const handleMessageRecieve = (data) => {
      //update state in database
      showNotification("New message", data.message);
      if (
        currentClient == data.from &&
        (user?.role === "coach" || user?.role === "clinic_admin")
      ) {
        console.log("message_delivered", data);
        socket.emit("message_delivered", {
          messageId: data.id,
          from: data.from,
        });

        setMessages((prevMessages) => [
          ...prevMessages,
          { ...data, status: "delivered" },
        ]);

        setUnread(0);
      } else if (user.email == data.to && user?.role === "client") {
        console.log("message_delivered", data);
        socket.emit("message_delivered", {
          messageId: data.id,
          from: data.from,
        });
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...data, status: "delivered" },
        ]);

        setUnread(0);
      }
    };

    socket.on("msg-recieve", handleMessageRecieve);
    socket.on("message-status", ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, status } : msg))
      );
      const updateMessage = async () => {
        try {
          const response = await fetch("/api/message/update", {
            method: "POST",
            body: JSON.stringify({
              id: messageId,
              status: status,
              email: user.email,
            }),
          });
          const jsondata = await response.json();
          if (jsondata.status) {
            toast.success("Message status updated successfully");
          } else {
            toast.error(jsondata.message);
          }
        } catch (error) {
          console.log("why not update", error);
          toast.error("Unable to update message");
        }
      };
      if (status === "delivered") {
        updateMessage();
      }
    });
    socket.emit("get_user_list");

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("msg-recieve", handleMessageRecieve);
      socket.off("disconnect", onDisconnect);
    };
  }, [currentClient, user]);

  useEffect(() => {
    if (coach) {
      fetchClients();
      fetchMessageHistory(coach.email);
    }
  }, [coach]);

  const firstUnreadIndex = messages.findIndex(
    (msg) => msg.status === "sent" && msg.to === user.email
  );

  const sendMessage = async () => {
    if (!newMessage.trim() || !isConnected) {
      toast.error("Cannot send message. Please check your connection.");
      return;
    }
    setIsSending(true);
    const messageId = uuidv4();
    let receiverMail = currentClient;

    if (user?.role === "client") {
      receiverMail = coach?.email;
    }

    if (!receiverMail) {
      toast.error("No recipient selected");
      setIsSending(false);
      return;
    }

    const messageToSend = {
      id: messageId,
      from: user.email,
      to: receiverMail,
      message: newMessage.trim(),
      status: "sent",
      timestamp: new Date(),
    };

    try {
      socket.emit("send-message", messageToSend);

      setMessages((prev) => [...prev, messageToSend]);
      setNewMessage("");

      const response = await fetch("/api/message/save", {
        method: "POST",
        body: JSON.stringify({
          id: messageId,
          message: newMessage.trim(),
          receiver: receiverMail,
          sender: user.email,
          status: "sent",
        }),
      });

      const data = await response.json();
      if (!data.status) {
        toast.error(data.message || "Failed to save message");
      }
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long", // e.g. "April"
      day: "numeric", // e.g. 21
      hour: "numeric", // e.g. 10 PM
      minute: "2-digit", // e.g. 15
      hour12: true, // 12-hour clock with AM/PM
    }).format(date);
  };

  const handlechange = (e) => {
    setCurrentClient(e);
    setUnreadUsers((prev) => prev.filter((user) => user.sender !== e.email));
  };
  console.log("unreadUsr", unreadUsers);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const unseenMessageIds = messages
      .filter((msg) => msg.to === user?.email && msg.status === "sent")
      .map((msg) => msg.id);
    if (unseenMessageIds.length > 0) {
      async function updateMessageStatus() {
        const response = await fetch("/api/message/viewed", {
          method: "POST",
          body: JSON.stringify({
            messageIds: unseenMessageIds,
            viewerEmail: user?.email,
          }),
        });
        const data = await response.json();
        const updatedMessages = data.updateMessage;
        if (data.status) {
          socket.emit("messages_viewed", updatedMessages);
          // toast.success("Message status updated successfully");
        } else {
          toast.error(data.message);
        }
      }
      updateMessageStatus();
    }
    console.log(toggle);
  }, [toggle]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    feachUnreadUsers();

  }, [unread]);
    console.log("unreadc",unread );
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <p className="text-sm text-muted-foreground">
            {isConnected ? "Connected" : "Disconnected"}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Coach:{" "}
          <span className="text-red-500">{coach ? coach.name : "..."}</span>
        </p>
      </div>

      {user?.role === "coach" || user?.role === "clinic_admin" ? (
        <div className="mb-4">
          <Label htmlFor="userList" className="mb-2">
            Select Client
          </Label>
          <Select
            name="userList"
            value={currentClient}
            onValueChange={handlechange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients?.map((client, index) => (
                <SelectItem value={client.email} key={index}>
                  {unreadUsers.some(
                    (unread) => unread.sender === client.email
                  ) && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "red",
                        marginRight: 8,
                        verticalAlign: "middle",
                      }}
                    ></span>
                  )}
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <Card className="flex-1 flex flex-col h-0 p-2 sm:p-4">
        <CardHeader className="px-2 sm:px-4 pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare size={20} className="text-primary" />
            Messages
          </CardTitle>
        </CardHeader>

        <CardContent className="px-2 sm:px-4 mb-4 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
              </div>
            </div>
          ) : messages && messages.length > 0 ? (
            <div className="space-y-4" key={messages.length}>
              {messages.map((msg, idx) => {
                return (
                  <React.Fragment key={msg.id}>
                    {idx === firstUnreadIndex && (
                      <div className="text-xs text-muted-foreground mt-2 mb-4">
                        <div className="flex items-center gap-2">
                          <hr className="flex-1" />
                          <span>Unread messages</span>
                          <hr className="flex-1" />
                        </div>
                      </div>
                    )}
                    <div className={`flex flex-col gap-2 w-full ${msg.from === user.email ? "items-end" : "items-start"}`}>
                      <div className={`flex items-start gap-2 max-w-[80%] ${msg.from === user.email ? "flex-row-reverse" : "flex-row"}`}>
                        <Avatar className="h-8 w-8">
                          {msg.senderAvatar ? (
                            <AvatarImage
                              src={msg.senderAvatar}
                              alt={msg.senderName}
                            />
                          ) : (
                            <AvatarFallback>
                              <User size={16} />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div
                            className={`px-4 py-2 rounded-lg text-sm flex justify-between ${
                              msg.from === user.email
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {msg.message}
                            <div className="ml-2 flex items-center">
                              {user.email === msg.from && (
                                <div className="flex items-center">
                                  {msg.status === "sent" && tickIcon}
                                  {msg.status === "delivered" && (
                                    <>
                                      <span className="mr-[-10px]">
                                        {tickIcon}
                                      </span>
                                      {tickIcon}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-muted-foreground">
                No messages yet. Send your first message!
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-2 sm:px-4 flex flex-col sm:flex-row gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full min-h-[40px] sm:min-h-[48px] text-sm sm:text-base"
            disabled={isSending || !isConnected}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button
            onClick={sendMessage}
            size="icon"
            disabled={!newMessage.trim() || isSending || !isConnected}
            className="w-full sm:w-auto"
          >
            {isSending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClientMessages;
