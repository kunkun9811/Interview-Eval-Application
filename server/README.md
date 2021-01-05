# Server Help

## How to create the conda environment

`>> conda env create -f environment.yml`

## How to start the conda environment

### On Windows

optional? `conda init powershell/bash/shellname`
`>> conda activate tldr_bot` OR `>> activate tldr_bot`

### On Mac

`>> source tldr_bot`

## How to remove the conda environment

`>> conda env remove -n ENV_NAME`

## setting up the flask server

### on Windows CMD

`C:\path\to\app> set FLASK_APP=server.py`
`C:\path\to\app> flask run`

### on Windows Powershell

`PS C:\path\to\app> $env:FLASK_APP = "server.py"`
`PS C:\path\to\app> flask run`

### on Mac

`$ export FLASK_APP=hello.py`
`$ flask run`
