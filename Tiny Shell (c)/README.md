# tsh - Tiny Shell

## Table of Contents
1. [Project Overview](#project-overview)  
2. [Prerequisites](#prerequisites)  
3. [Tools and Technologies](#tools-and-technologies)  
4. [Running the Project](#running-the-project)  
5. [Commands Supported](#commands-supported)  
   - [Built‑in Commands](#built‑in-commands)  
   - [Redirection](#redirection)  
   - [Signals](#signals)  
   - [Job Control](#job-control)  
   - [Pipelines](#pipelines)  
6. [Code Access](#code-access)  
7. [Collaborators](#collaborators)  


## Project Overview

This project is a Unix-style shell called `tsh` (tiny shell), written in C. It mimics the basic behavior of shells like Bash by allowing users to run commands, manage jobs, and control processes directly from the terminal.

The shell repeatedly displays a prompt where the user can enter commands. It parses these commands and supports features such as:

- **Built-in commands**: like `quit`, `jobs`, `bg`, and `fg`.


- **Foreground and background job control**: Users can run programs in the background using `&`, or bring jobs to the foreground or background using `fg` and `bg` commands.


- **Signal handling**: It handles user-generated signals like `Ctrl+C` (`SIGINT`) and `Ctrl+Z` (`SIGTSTP`) to control foreground jobs.


- **Process management**: Each job is assigned a process ID (PID) by the system and a job ID (JID) by the shell. The shell tracks jobs and properly handles job states and termination.


- **Input/output redirection**: It supports `<` and `>` for redirecting input and output files, and handles both orderings (input before output and vice versa).


- **Pipelines (`|`)**: Users can link multiple commands using pipes, allowing the output of one command to be used as the input for the next.


- **Zombie process cleanup**: The shell cleans up terminated child processes to prevent zombies and reports any job that ends due to an uncaught signal.

By combining these features, `tsh` provides a functional and simplified environment to interact with the system, practice process control, and explore Unix/Linux internals.

---

### Prerequisites:
Ensure that you have a C compiler installed (e.g., `gcc`) and the necessary build tools (`make`).

---

## Tools and Technologies

This project is developed using the following tools and technologies:

- **Programming Language**: C
- **Build System**: `Makefile` (for compiling the C code)
- **Libraries/Functions**: 
  - Standard C Library (`stdio.h`, `stdlib.h`, `string.h`, etc.)
  - `signal.h` for handling signals (`SIGINT`, `SIGTSTP`, etc.)
  - `unistd.h` for process management functions (`fork`, `exec`, `waitpid`, etc.)
  - `sys/wait.h` for handling process termination and job control

---


## Running the Project

1. **Build the shell**
```
make
```
This produces **tsh** (your tiny shell)

2. **Start the shell**
```
./tsh
```

You will see the prompt:
```
tsh>
```
---

## Commands Supported

### Built-in Commands

- **`quit`**: Terminates the shell.
- **`jobs`**: Lists all background jobs with their respective job IDs (JID).
- **`bg <job>`**: Restarts a background job using its PID or JID and runs it in the background.
- **`fg <job>`**: Restarts a job using its PID or JID and runs it in the foreground.

---

#### `quit`
Terminate the shell and return to your parent terminal.
```bash
tsh> quit
```
> **Explanation:** Exits `tsh` immediately.

---

#### `jobs`
List all background and stopped jobs, showing their Job ID (JID), PID, state, and command line.

```bash
# Start a 60-second sleep in the background
tsh> sleep 60 &
[1] (12345) sleep 60 &

# List jobs
tsh> jobs
[1] (12345) Running    sleep 60 &
```
> **Explanation:**  
> - `%1` refers to job JID 1  
> - `(12345)` is its PID  
> - `sleep 60` pauses for 60 seconds before the job exits  
> - `&` runs the job in the background  
> - `Running` indicates the job is still active

---

#### `bg <job>`
Restart a stopped job in the background. `<job>` can be `%JID` or `PID`.
```bash
tsh> Ctrl+Z
[1]   Stopped    vim myfile.txt
tsh> bg %1
[1] (12345) vim myfile.txt &
```
> **Explanation:** Sends `SIGCONT` to the job’s process group and resumes it in the background.

---

#### `fg <job>`
Bring a background or stopped job into the foreground.
```bash
tsh> jobs
[1] (12345) Running    sleep 60 &
tsh> fg %1
sleep 60
# now the shell waits until sleep completes
```
> **Explanation:** Sends `SIGCONT` (if needed) and attaches the job to your terminal so you can interact with it.

---

### Redirection

- **`<`**: Redirects input from a file.
- **`>`**: Redirects output to a file.
- **Support for both `< >` orderings**: Allows flexible command chaining with redirections in any order.

---

#### Input redirection `<`
Read a file as the program’s stdin.
```bash
tsh> sort < unsorted.txt
```
> **Explanation:**  
> - `unsorted.txt` is opened and used as the command’s standard input.  
> - The input file provides the data the program processes.

---

#### Output redirection `>`
Write a program’s stdout to a file.
```bash
tsh> ls -l > filelist.txt
```
> **Explanation:**  
> - `filelist.txt` is created (or truncated) and opened for writing.  
> - `ls -l` writes its formatted directory listing into that file.

---

#### Both `<` and `>`
The order of `<` and `>` doesn’t matter:
```bash
tsh> grep foo < input.txt > matches.txt
tsh> grep foo > matches.txt < input.txt
```
> **Explanation:**  
> 1. `input.txt` is opened and fed into `grep` as its standard input.  
> 2. `matches.txt` is opened for writing, capturing only the lines that contain “foo.”  
> 3. The shell reads from the input file and writes matches to the output file.

---

### Signals

- **`Ctrl+C`**: Sends `SIGINT` to the current foreground job.
- **`Ctrl+Z`**: Sends `SIGTSTP` to the current foreground job.

---

#### `Ctrl+C` (SIGINT)
Press while a foreground job is running:
```bash
tsh> sleep 100
# press Ctrl+C
Job (12345) terminated by signal 2
tsh>
```
> **Explanation:** Sends `SIGINT` to the entire foreground process group. The shell catches it, prints a message, and returns to the prompt.

---

#### `Ctrl+Z` (SIGTSTP)
Press to suspend the foreground job:
```bash
tsh> sleep 100
# press Ctrl+Z
[1]   Stopped    sleep 100
tsh>
```
> **Explanation:** Sends `SIGTSTP`, which stops the job but keeps it in the job list. Use `bg` or `fg` to resume.

---

### Job Control

- Each job is identified by a **Job ID (JID)** and **Process ID (PID)**.
- Users can use `%` to reference a job by JID and simple integers to reference jobs by PID.
- Supports job status management including suspending, resuming, and terminating jobs.


- **JID vs. PID**  
  - JID: `%1`, `%2`, … (assigned by `tsh`)  
  - PID: `12345`, `12346`, … (assigned by the OS)

- **Referencing jobs**  
  ```bash
  tsh> bg 12345     # by PID
  tsh> fg %2        # by JID
  ```

- **State transitions**  
  1. **Running in foreground** → `Ctrl+Z` → **Stopped**  
  2. **Stopped** → `bg` → **Running** (in background)  
  3. **Running** (background) → `fg` → **Running** (foreground)

---

### Pipelines

- Supports chains of commands separated by `|`, passing the output of one command as input to the next.

```bash
tsh> cat file.txt | grep error | wc -l
42
```
> **Explanation:**  
> 1. `cat` reads `file.txt` and writes to a pipe.  
> 2. `grep error` reads from that pipe and writes matches to a second pipe.  
> 3. `wc -l` reads from the second pipe and counts lines.

---

###  Code Access

To comply with academic integrity policies, 
the complete source code is not publicly hosted on GitLab. However, a comprehensive demo video is available that explains the implementation details and shows the programs in action. 


If you need access to the source code, please reach out directly—code will be shared upon request.

### Collaborators
This project was developed by **Nizar Shayan** and **Derek Tang**. Special thanks to Derek for his collaboration in this project.