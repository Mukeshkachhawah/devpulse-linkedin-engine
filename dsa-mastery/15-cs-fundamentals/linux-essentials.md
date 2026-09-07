# Linux Essentials (Interview Core)

**Module:** 15-cs-fundamentals  
**Level target:** L3–L4  
**Prerequisite:** using a terminal a little; files/folders concept  
**Memory picture:** Linux is a city. The shell is your taxi radio. Processes are citizens. Files are addresses (even devices look like files). Permissions are door keys.

---

## 1. What is it?

**Linux essentials** for engineers: shell navigation, processes, permissions, pipes, basic networking tools, and how this shows up in interviews / on-call / Docker hosts.

You don’t need to be a kernel hacker. You need to **not be helpless** on a box.

New words:

- **Shell** — program that reads commands (`bash`, `zsh`).  
- **Process** — running program instance.  
- **stdin/stdout/stderr** — standard input/output/error streams.  
- **Pipe `|`** — connect stdout of one command to stdin of next.  
- **Permission bits** — who can read/write/execute.  
- **Signal** — software interrupt to a process (`SIGTERM`, `SIGKILL`).  
- **Exit code** — 0 usually success; non-zero failure.

---

## 2. Explain like I am 10

The computer has a text remote control. You type “show me files,” “run this program,” “stop that noisy program.” Pipes are like connecting toy tubes so one’s output becomes another’s input.

---

## 3. Why it exists / without it

Servers, containers, CI, and most cloud VMs speak Linux. Without shell literacy: slower debugging, can’t read logs, scary production moments.

Before friendly GUIs dominated servers, shells were *the* interface — they remain the reliable one.

---

## 4. Filesystem mental map

```text
/                 root
├── home/you      your files
├── etc/          config
├── var/log/      logs
├── tmp/          temporary
├── proc/         kernel/process info (virtual)
└── usr/bin/      programs
```

**Everything is a file** (idea): regular files, directories, many devices, pipes.

---

## 5. Core commands (muscle memory)

```bash
pwd                 # where am I?
ls -la              # list (including hidden)
cd /path            # change directory
mkdir -p a/b        # make dirs
cp -r src dst       # copy
mv old new          # move/rename
rm -rf path         # DANGER: recursive delete
cat file            # print file
less file           # scroll file
head -n 20 file
tail -n 20 file
tail -f file        # follow growing log
```

**Interview tip:** Know `rm -rf` is dangerous; prefer safer habits.

---

## 6. Permissions

```text
-rwxr-xr--  1 user group  ...  script.sh
 type user group others
```

- `r=4, w=2, x=1` → e.g. `755` = owner rwx, group/others rx.  
- `chmod 644 file` common for files.  
- `chown user:group file` changes owner (needs privilege).

**Execute bit on directory:** means you can traverse into it.

---

## 7. Pipes, redirects, exit codes

```bash
grep "ERROR" app.log | tail -n 50
./app > out.txt 2> err.txt     # stdout, stderr separate
./app > all.txt 2>&1           # merge stderr into stdout
echo $?                        # last exit code
```

```text
cmd1 | cmd2 | cmd3
stdout──┘
```

---

## 8. Processes

```bash
ps aux | head
top          # or htop
jobs         # shell background jobs
ctrl-z       # suspend
bg / fg
kill PID           # SIGTERM polite
kill -9 PID        # SIGKILL force (last resort)
```

**Interview:** Prefer `SIGTERM` so apps can flush/cleanup; `SIGKILL` cannot be caught.

```text
fork/exec model (idea):
parent → fork child → exec new program image
```

---

## 9. Searching & editing survival

```bash
find . -name "*.cpp"
grep -R "TODO" -n .
rg "pattern" .          # if ripgrep installed
```

Editors: `nano` for survival; `vim` basics (`i`, `Esc`, `:wq`, `:q!`) often expected culturally.

---

## 10. Networking triage commands

```bash
curl -I https://example.com
curl -v ...
ss -lptn          # listening ports (modern)
# netstat -lptn   # older
ping -c 3 8.8.8.8
dig example.com   # or nslookup
```

**On-call story:** “Port already bound” → `ss` find who owns it.

---

## 11. Environment, PATH, variables

```bash
echo $PATH
export MY_ENV=hello
which g++
```

Programs looked up via `PATH`. Missing dependency often = wrong PATH / not installed.

---

## 12. SSH & remote reality (conceptual)

```bash
ssh user@host
scp file user@host:/path
```

Keys > passwords. Know `~/.ssh/authorized_keys` idea.

---

## 13. Common interview Q&A

**Q1. What does `chmod +x script.sh` do?**  
A: Adds execute permission so the file can run as a program (subject to other rules).

**Q2. Difference `>` and `>>`?**  
A: Overwrite vs append redirect.

**Q3. What is a pipe?**  
A: Connects stdout of left command to stdin of right without a temp file (conceptually).

**Q4. How do you find which process uses port 8080?**  
A: `ss -lptn | grep 8080` (or `lsof -i :8080`).

**Q5. SIGTERM vs SIGKILL?**  
A: Term can be handled/cleaned; Kill forced, not catchable.

**Q6. What is `stderr`?**  
A: Separate error stream so diagnostics don’t corrupt data stdout pipelines.

**Q7. How to follow logs live?**  
A: `tail -f`.

**Q8. What does exit code 0 mean?**  
A: Conventionally success.

**Q9. Absolute vs relative path?**  
A: From `/` vs from current directory.

**Q10. Why can’t I run `./script` but `bash script` works?**  
A: Often missing execute bit, or wrong shebang, or no `./` in PATH.

---

## 14. Tiny C++ + Linux connection

```cpp
#include <iostream>
int main() {
    std::cout << "hello stdout\n";
    std::cerr << "hello stderr\n";
    return 0; // exit code
}
```

```bash
./a.out > o.txt 2> e.txt
```

---

## 15. Visualization — pipeline

```text
cat log.txt  →  grep ERROR  →  wc -l
  file bytes     filter lines    count
```

---

## 16. Wrong Thinking → Correct Thinking

```text
"kill -9 first always."
        ↓
Skips cleanup; can corrupt state.
        ↓
"SIGTERM, wait, then escalate."
```

```text
"Linux interview = memorize 200 flags."
        ↓
You freeze on real problems.
        ↓
"Learn composable tools + how to man/help."
```

---

## 17. Common mistakes

- Running destructive `rm` in `/`.  
- Forgetting `2>&1` when grepping logs.  
- Editing production configs with no backup.  
- Assuming GUI tools exist on servers.  

---

## 18. Company use cases

Deployments, Docker, reading pod logs, CI failures, “disk full” (`df -h`), permission incidents.

Useful extras: `df -h`, `du -sh *`, `free -h`, `uptime`.

---

## 19. Related concepts

OS processes, networks (`curl`), compilers (`g++`), concurrency (multiple processes), debugging.

---

## 20. Revision checklist

- [ ] Navigate + list + peek logs  
- [ ] Permissions octal idea  
- [ ] Pipes/redirects  
- [ ] `ps`/`kill` signals  
- [ ] `ss`/`curl` triage  
- [ ] Exit codes  

**Spaced repetition:** On a real shell, redo pipes+permissions weekly.  
**Practice:** Find ERROR lines in a sample log with `grep|tail`.  
**Exit check:** Debug “port in use” narrating commands you’d run.
