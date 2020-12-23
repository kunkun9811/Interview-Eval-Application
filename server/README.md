# How to create the conda environment:

`>> conda env create -f environment.yml`

# How to start the conda environment:
## On Windows:
`>> activate tldr_bot`
## On Mac:
`>> source tldr_bot`

# How to remove the conda environment:

`>> conda env remove -n ENV_NAME`

# setting up the flask server:
## on Windows CMD:
`C:\path\to\file>set FLASK_APP=server.py`, then `flask run`
## on Mac:
`$ export FLASK_APP=hello.py` then 
`$ flask run`
