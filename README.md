# Static Website with Jenkins CI/CD Pipeline

A simple static website project designed to demonstrate CI/CD concepts using Jenkins and Docker.

## Project Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS stylesheet
├── script.js           # JavaScript functionality
├── Dockerfile          # Docker container configuration
├── Jenkinsfile         # Jenkins pipeline configuration
└── README.md           # Project documentation
```

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with animations
- **Interactive Elements**: Contact form, smooth scrolling, hover effects
- **Build Information**: Displays build number and date (injected by Jenkins)
- **Docker Ready**: Containerized using Nginx for serving static files
- **CI/CD Pipeline**: Complete Jenkins pipeline with staging and production deployments

## Quick Start

### Local Development

1. Clone the repository
2. Open `index.html` in your browser
3. Make changes and refresh to see updates

### Docker Deployment

```bash
# Build the Docker image
docker build -t static-website .

# Run the container
docker run -d -p 8080:80 --name my-website static-website

# Access the website
open http://localhost:8080
```

## Jenkins Pipeline Setup

### Prerequisites

1. Jenkins server with Docker installed
2. Docker Pipeline plugin installed in Jenkins
3. Git repository containing this project

### Setting Up the Pipeline

1. **Create New Pipeline Job**:
   - In Jenkins dashboard, click "New Item"
   - Enter job name (e.g., "static-website-pipeline")
   - Select "Pipeline" and click OK

2. **Configure Pipeline**:
   - Under "Pipeline" section:
     - Definition: "Pipeline script from SCM"
     - SCM: Git
     - Repository URL: `your-git-repository-url`
     - Script Path: `Jenkinsfile`

3. **Set Up Webhooks** (Optional):
   - GitHub: Repository Settings → Webhooks → Add webhook
   - URL: `http://your-jenkins-url:8080/github-webhook/`
   - Content type: `application/json`
   - Events: "Just the push event"

### Pipeline Stages

The Jenkins pipeline includes the following stages:

1. **Checkout**: Retrieves source code from Git
2. **Validate Files**: Ensures all required files are present
3. **Process Build Info**: Injects build number and date into the website
4. **Test HTML Validation**: Basic HTML structure validation
5. **Build Docker Image**: Creates Docker image with the website
6. **Test Docker Image**: Verifies the Docker image works correctly
7. **Deploy to Staging**: Deploys to staging environment (port 8081)
8. **Staging Tests**: Runs tests against staging deployment
9. **Deploy to Production**: Deploys to production (only for main/master branch)
10. **Production Health Check**: Verifies production deployment
11. **Cleanup Old Images**: Removes old Docker images to save space

### Environment Variables

The pipeline uses the following environment variables:

- `IMAGE_NAME`: Docker image name (static-website)
- `IMAGE_TAG`: Build number used as Docker tag
- `STAGING_PORT`: Port for staging deployment (8081)
- `PRODUCTION_PORT`: Port for production deployment (8080)
- `BUILD_DATE`: Timestamp of the build

### Deployment Environments

- **Staging**: `http://localhost:8081` (deployed on every build)
- **Production**: `http://localhost:8080` (deployed only from main/master branch)

## Customization

### Modifying the Website

1. **HTML Content**: Edit `index.html` to change page content
2. **Styling**: Modify `styles.css` to change appearance
3. **Functionality**: Update `script.js` to add interactive features

### Customizing the Pipeline

1. **Change Ports**: Modify `STAGING_PORT` and `PRODUCTION_PORT` in Jenkinsfile
2. **Add Tests**: Add more validation stages in the pipeline
3. **Notifications**: Add Slack/email notifications in the `post` section
4. **Security Scans**: Add security scanning stages
5. **Performance Tests**: Add performance testing with tools like Lighthouse

### Docker Configuration

The Dockerfile uses Nginx Alpine image for lightweight deployment:

- **Base Image**: `nginx:alpine`
- **Port**: 80 (mapped to host ports via Docker run command)
- **Health Check**: Built-in health check endpoint
- **Auto-restart**: Containers restart automatically unless stopped

## Testing

### Manual Testing

1. **Local Testing**: Open files directly in browser
2. **Docker Testing**: Build and run Docker container locally
3. **Staging Testing**: Access staging environment after pipeline runs

### Automated Testing

The pipeline includes automated tests for:

- HTML structure validation
- Docker image functionality
- HTTP response codes
- Static asset accessibility

## Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   # Stop existing container
   docker stop production-website staging-website
   docker rm production-website staging-website
   ```

2. **Docker Permission Denied**:
   ```bash
   # Add Jenkins user to docker group
   sudo usermod -aG docker jenkins
   sudo systemctl restart jenkins
   ```

3. **Pipeline Fails on Image Build**:
   - Check Dockerfile syntax
   - Ensure all files are present in repository
   - Verify Docker is running on Jenkins agent

### Monitoring

- **Container Logs**: `docker logs production-website`
- **Jenkins Logs**: Available in Jenkins job console output
- **Health Check**: `curl -f http://localhost:8080`

## Best Practices

1. **Branch Strategy**: Use feature branches and merge to main for production
2. **Version Tags**: Tag releases for better tracking
3. **Resource Limits**: Set Docker resource limits for production
4. **Backup**: Regular backup of Jenkins configuration
5. **Security**: Use HTTPS in production environments
6. **Monitoring**: Implement proper monitoring and alerting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

The CI/CD pipeline will automatically test your changes when you push to a branch.

## License

This project is for educational purposes and demonstrates CI/CD concepts with Jenkins and Docker.
