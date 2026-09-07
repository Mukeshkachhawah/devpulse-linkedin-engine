# Computer Networks (Interview Core)

**Module:** 15-cs-fundamentals  
**Level target:** L4  
**Prerequisite:** client/server idea, HTTP as a user of the web  
**Memory picture:** Networks are postal systems for computers — envelopes (packets), addresses (IP), delivery guarantees (TCP), and postcards (UDP).

---

## 1. What is it?

**Computer networking** is how machines exchange data. Interviews focus on the **layered model**, **TCP vs UDP**, **HTTP/HTTPS**, **DNS**, **sockets**, and debugging latency/reliability.

New words:

- **Packet** — small chunk of data on the wire.  
- **IP address** — network address for a host (v4/v6).  
- **Port** — number identifying an application endpoint on a host.  
- **Socket** — programming endpoint (IP + port + protocol).  
- **Latency** — time delay.  
- **Bandwidth** — throughput capacity.  
- **TLS** — encryption layer for HTTPS.

---

## 2. Explain like I am 10

You send LEGO instructions to a friend in another city. You tear the manual into postcards (packets), number them, and the post office (network) delivers them. Sometimes a postcard is lost — you resend (TCP). Sometimes you shout “dinner!” once and don’t care if they miss it (UDP).

---

## 3. Why it exists / life without it

Without networks: USB sneakernet only. With networks: web, APIs, games, distributed DBs. Without network literacy in interviews: you can’t explain timeouts, load balancers, or “it works on my machine.”

**Problem before layers:** every app reinvented error recovery and routing. Layers split jobs.

---

## 4. Layer mental model (practical)

Use a simplified stack (OSI 7 is academic; interviews love this practical view):

```text
Application   HTTP, DNS, WebSocket, gRPC
Transport     TCP, UDP
Network       IP (routing)
Link/Physical Wi-Fi, Ethernet, cables, radio
```

**Kid analogy:** Writing a letter (app) → putting in envelope with tracking (TCP) → street address (IP) → trucks/roads (link/physical).

---

## 5. IP, ports, sockets

```text
Host 203.0.113.5
  :443  HTTPS server
  :22   SSH
  :5432 Postgres

Client ephemeral port -----> Server :443
```

**Socket programming idea (C++ asio/POSIX):** connect/send/recv/close or listen/accept.

IPv4 example: `192.168.1.10`. IPv6 is longer; know it exists.

**NAT:** home router shares one public IP among devices; complicates inbound connections.

---

## 6. TCP vs UDP

| | TCP | UDP |
|---|---|---|
| Connection | Handshake (SYN…) | Connectionless |
| Reliability | ACK, retransmit | Best effort |
| Order | Ordered byte stream | Datagrams may reorder |
| Speed/overhead | Higher overhead | Lower overhead |
| Use | HTTP, SSH, DB clients | Games, DNS (often), video/voice |

**TCP mental picture:**

```text
Reliable pipe of bytes
Client <================> Server
lost packet → retransmit
congestion control slows senders when network sick
```

**UDP mental picture:** throw packets; app handles loss if needed.

**Interview line:** “TCP for correctness of byte stream; UDP when latency matters and loss is OK or handled above.”

---

## 7. TCP handshake & close (must know)

**Three-way handshake:**

```text
Client        Server
 SYN    →
        ←  SYN-ACK
 ACK    →
   (connection established)
```

**Common close:** FIN/ACK sequence (know conceptually).  
**RST:** abrupt reset.

**TIME_WAIT:** why many short connections can exhaust ports — reason for keep-alive / pools.

---

## 8. HTTP / HTTPS

HTTP = application protocol over TCP (usually). Request/response:

```text
GET /api/user?id=1 HTTP/1.1
Host: example.com

200 OK
Content-Type: application/json
{"id":1,"name":"Ada"}
```

Key ideas:

- **Methods:** GET (read), POST (create/action), PUT/PATCH, DELETE.  
- **Status codes:** 2xx success, 3xx redirect, 4xx client error, 5xx server error.  
- **Headers:** metadata (auth, content-type, cache).  
- **HTTP/1.1 keep-alive:** reuse TCP connection.  
- **HTTP/2:** multiplexing streams on one connection.  
- **HTTPS:** HTTP over **TLS** (encryption + authentication of server cert).

**Idempotent:** multiple identical requests have same effect (GET/PUT ideologically); POST often not.

---

## 9. DNS

Humans use names; computers need IPs.

```text
browser → resolver → maybe root/TLD/auth nameservers
example.com → 93.184.216.34
```

**Caching** at OS/browser/resolver levels. TTL controls freshness.  
**Interview:** DNS failure looks like “internet down” but isn’t always.

---

## 10. Latency vs bandwidth (interview gold)

```text
Latency = how long for first bit round trip (RTT)
Bandwidth = how many bits per second once flowing
```

Small messages care about RTT (chatty APIs). Large downloads care about bandwidth.  
**Nagle / delayed ACK / too many RPCs** → death by latency.

**Fan-out:** one user request → many internal service calls → tail latency compounds.

---

## 11. Load balancing, reverse proxies (overview)

```text
Client → DNS → Load Balancer → [App1 App2 App3] → DB
```

LB spreads traffic; health checks remove sick nodes. Reverse proxy terminates TLS, routes, caches.

Know words: round-robin, least-conn, sticky sessions (careful), L4 vs L7 balancing.

---

## 12. Security basics expected in interviews

- **TLS:** encrypts in transit; prevents casual eavesdropping/tampering.  
- **CORS:** browser rule for cross-origin HTTP — not a server firewall replacement.  
- **Auth headers / cookies / tokens:** how identity travels.  
- **DDoS:** overwhelm with traffic; mitigation at edge.  

Don’t overclaim crypto expertise — clarity beats buzzwords.

---

## 13. Common interview Q&A

**Q1. TCP vs UDP?**  
A: Reliability/order vs low-overhead datagrams; examples.

**Q2. What happens when you type a URL?**  
A: DNS → TCP(+TLS) → HTTP request → server → response → render. Mention cache hits possibly skipping steps.

**Q3. Difference HTTP and HTTPS?**  
A: TLS encryption/auth; HTTPS uses certificates.

**Q4. What is a socket?**  
A: Endpoint for communication; API for send/recv.

**Q5. Why use connection pools?**  
A: Avoid repeated handshakes/TIME_WAIT; reuse expensive connections (DB/HTTP).

**Q6. What causes high latency?**  
A: DNS, TLS handshake, distance RTT, congestion, server queueing, cold caches, chatty protocols.

**Q7. GET vs POST?**  
A: Semantics; GET safe/idempotent retrieval; POST submit/actions; don’t put secrets in URLs.

**Q8. What is CDN?**  
A: Edge caches closer to users for static (and sometimes dynamic) content — cuts latency.

**Q9. TCP congestion control purpose?**  
A: Protect the network; senders slow down when loss/delay signals congestion.

**Q10. IPv4 vs IPv6?**  
A: Address space; coexistence; know NAT relevance for v4.

---

## 14. Tiny C++ mental socket sketch (POSIX-style idea)

```cpp
// Pseudocode-shaped teaching sketch (not full error handling)
// server: socket() → bind() → listen() → accept() → recv/send → close
// client: socket() → connect() → send/recv → close

#include <string>
#include <iostream>
using namespace std;

// In real code you'd use OS APIs or a library (Boost.Asio).
// Interview: describe the state machine, don't memorize every flag.
void explainClient() {
    cout << "DNS → TCP connect → TLS optional → HTTP bytes → close/reuse\n";
}
```

---

## 15. Visualization — packet journey

```text
App data
  → TCP segment (ports, seq)
    → IP packet (src/dst IP)
      → Ethernet frame
        → physical bits
```

---

## 16. Wrong Thinking → Correct Thinking

```text
"Bandwidth is low so website feels slow."
        ↓
Often RTT and chatty calls dominate.
        ↓
"Measure RTT, waterfalls, and #round trips."
```

```text
"UDP is useless because unreliable."
        ↓
Many realtime systems want UDP + app logic.
        ↓
"Match protocol to loss/latency needs."
```

---

## 17. Common mistakes

- Confusing IP with MAC with domain name.  
- Saying HTTP is in the transport layer.  
- Ignoring TLS cost on first connection.  
- Believing TCP guarantees *message* boundaries (it is a byte stream — you must frame).  

---

## 18. Company use cases

APIs, microservices, mobile backends, video, multiplayer, cloud networking, observability of timeouts.

---

## 19. Related concepts

OS (sockets are syscalls), databases (wire protocols), concurrency (many connections), Linux (`netstat`/`ss`, `curl`).

---

## 20. Revision checklist

- [ ] Layers practical stack  
- [ ] TCP vs UDP table  
- [ ] 3-way handshake  
- [ ] URL → response path  
- [ ] HTTP status families  
- [ ] Latency vs bandwidth  

**Spaced repetition:** Narrate “type URL” weekly.  
**Practice:** `curl -v` a site; identify DNS/connect/TLS/HTTP timing mentally.  
**Exit check:** Teach TCP vs UDP with examples in 90 seconds.
