#!/bin/bash

echo "Setting up Jenkins dependencies for static website CI/CD pipeline..."

# Update system
sudo apt update

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
else
    echo "Docker is already installed"
fi

# Install Git if not already installed
if ! command -v git &> /dev/null; then
    echo "Installing Git..."
    sudo apt install -y git
else
    echo "Git is already installed"
fi

# Install curl if not already installed
if ! command -v curl &> /dev/null; then
    echo "Installing curl..."
    sudo apt install -y curl
else
    echo "curl is already installed"
fi

# Add jenkins user to docker group
echo "Adding jenkins user to docker group..."
sudo usermod -aG docker jenkins

# Restart Jenkins to apply group changes
echo "Restarting Jenkins service..."
sudo systemctl restart jenkins

# Test Docker access
echo "Testing Docker installation..."
docker --version
docker ps


#!/bin/bash

echo "Setting up Jenkins dependencies for static website CI/CD pipeline..."

# Update system
sudo apt update

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
else
    echo "Docker is already installed"
fi

# Install Git if not already installed
if ! command -v git &> /dev/null; then
    echo "Installing Git..."
    sudo apt install -y git
else
    echo "Git is already installed"
fi

# Install curl if not already installed
if ! command -v curl &> /dev/null; then
    echo "Installing curl..."
    sudo apt install -y curl
else
    echo "curl is already installed"
fi

# Add jenkins user to docker group
echo "Adding jenkins user to docker group..."
sudo usermod -aG docker jenkins

# Restart Jenkins to apply group changes
echo "Restarting Jenkins service..."
sudo systemctl restart jenkins

# Test Docker access
echo "Testing Docker installation..."
docker --version
docker ps

echo "Setup Complete!"
