# 🐳 Dockerized Microservices Platform

> Enterprise-grade microservices architecture with Docker containers, Kubernetes orchestration, service mesh, monitoring, and automated CI/CD pipelines.

## 📊 Project Overview

- **Status**: ✅ Completed
- **Timeline**: Q4 2024 - June 2025 (5-6 months)
- **Complexity**: ⭐⭐⭐⭐⭐ Expert
- **Type**: DevOps & Cloud-Native Architecture

## 🎯 Project Description

Build a comprehensive microservices platform that demonstrates modern cloud-native architecture patterns. Features containerized services, Kubernetes orchestration, service mesh communication, distributed monitoring, and automated deployment pipelines with high availability and scalability.

## ✨ Key Features

### Microservices Architecture
- **Service Decomposition**: Domain-driven service boundaries
- **API Gateway**: Centralized routing and load balancing
- **Service Discovery**: Automatic service registration and discovery
- **Circuit Breakers**: Fault tolerance and resilience patterns
- **Distributed Tracing**: Request flow tracking across services
- **Event-Driven Communication**: Asynchronous messaging patterns

### Container Orchestration
- **Docker Containerization**: Multi-stage builds and optimization
- **Kubernetes Deployment**: Pod, Service, and Ingress management
- **Helm Charts**: Package management and templating
- **Auto-scaling**: Horizontal Pod Autoscaler (HPA) and Vertical Pod Autoscaler (VPA)
- **Rolling Updates**: Zero-downtime deployments
- **ConfigMaps & Secrets**: Configuration and secret management

### Infrastructure as Code
- **Terraform**: Cloud resource provisioning
- **Kubernetes Manifests**: Declarative infrastructure
- **GitOps**: Infrastructure version control and automation
- **Multi-environment**: Dev, staging, and production environments
- **Resource Management**: CPU, memory, and storage optimization
- **Security Policies**: Network policies and RBAC

### Monitoring & Observability
- **Metrics Collection**: Prometheus and custom metrics
- **Log Aggregation**: Centralized logging with ELK stack
- **Distributed Tracing**: Jaeger for request tracing
- **Application Performance Monitoring**: Performance insights
- **Alerting**: Smart alerting and notification systems
- **Dashboards**: Real-time operational dashboards

## 🛠 Technical Stack

### Core Services (Microservices)
- **User Service**: Node.js + Express + MongoDB
- **Product Service**: Python + FastAPI + PostgreSQL
- **Order Service**: Java + Spring Boot + MySQL
- **Payment Service**: Go + Gin + Redis
- **Notification Service**: Node.js + WebSocket + RabbitMQ
- **File Service**: Python + FastAPI + MinIO

### Container & Orchestration
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes (K8s) + Helm
- **Service Mesh**: Istio for advanced traffic management
- **Load Balancing**: NGINX Ingress Controller
- **Storage**: Persistent Volumes with CSI drivers

### Infrastructure
- **Cloud Platform**: AWS EKS or Google GKE
- **Infrastructure as Code**: Terraform + Terragrunt
- **CI/CD**: GitHub Actions + ArgoCD
- **Container Registry**: Docker Hub or AWS ECR
- **DNS & Certificates**: External-DNS + Cert-Manager

### Monitoring Stack
- **Metrics**: Prometheus + Grafana
- **Logging**: Fluentd + Elasticsearch + Kibana
- **Tracing**: Jaeger + OpenTelemetry
- **APM**: New Relic or DataDog
- **Uptime Monitoring**: Pingdom or UptimeRobot

### Message Queue & Cache
- **Message Broker**: RabbitMQ or Apache Kafka
- **Caching**: Redis Cluster
- **Database**: PostgreSQL, MongoDB, MySQL
- **Search**: Elasticsearch
- **Object Storage**: MinIO or AWS S3

## 🏗 Architecture Overview

```mermaid
graph TB
    subgraph "External"
        Client[Client Applications]
        CDN[CloudFlare CDN]
    end
    
    subgraph "Ingress Layer"
        LB[Load Balancer]
        Ingress[NGINX Ingress]
        Gateway[API Gateway]
    end
    
    subgraph "Service Mesh"
        Istio[Istio Service Mesh]
    end
    
    subgraph "Microservices"
        UserSvc[User Service]
        ProductSvc[Product Service]
        OrderSvc[Order Service]
        PaymentSvc[Payment Service]
        NotificationSvc[Notification Service]
        FileSvc[File Service]
    end
    
    subgraph "Data Layer"
        Postgres[(PostgreSQL)]
        MongoDB[(MongoDB)]
        MySQL[(MySQL)]
        Redis[(Redis Cache)]
        MinIO[(MinIO Storage)]
    end
    
    subgraph "Message Queue"
        RabbitMQ[RabbitMQ]
        Kafka[Apache Kafka]
    end
    
    subgraph "Monitoring"
        Prometheus[Prometheus]
        Grafana[Grafana]
        Jaeger[Jaeger]
        ELK[ELK Stack]
    end
    
    Client --> CDN
    CDN --> LB
    LB --> Ingress
    Ingress --> Gateway
    Gateway --> Istio
    Istio --> UserSvc
    Istio --> ProductSvc
    Istio --> OrderSvc
    Istio --> PaymentSvc
    Istio --> NotificationSvc
    Istio --> FileSvc
    
    UserSvc --> MongoDB
    ProductSvc --> Postgres
    OrderSvc --> MySQL
    PaymentSvc --> Redis
    
    UserSvc --> RabbitMQ
    NotificationSvc --> RabbitMQ
    OrderSvc --> Kafka
    
    FileSvc --> MinIO
```

## 🐳 Docker Configuration

### Multi-stage Dockerfile Example

```dockerfile
# User Service Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder --chown=nodeuser:nodejs /app/dist ./dist
COPY --from=builder --chown=nodeuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodeuser:nodejs /app/package.json ./

# Security: Run as non-root user
USER nodeuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

### Docker Compose for Local Development

```yaml
version: '3.8'

services:
  # API Gateway
  api-gateway:
    build: ./api-gateway
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=development
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    networks:
      - microservices-network

  # User Service
  user-service:
    build: ./user-service
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongodb:27017/users
      - RABBITMQ_URL=amqp://rabbitmq:5672
    depends_on:
      - mongodb
      - rabbitmq
    networks:
      - microservices-network

  # Product Service
  product-service:
    build: ./product-service
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/products
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - microservices-network

  # Order Service
  order-service:
    build: ./order-service
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/orders
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=password
      - KAFKA_BOOTSTRAP_SERVERS=kafka:9092
    depends_on:
      - mysql
      - kafka
    networks:
      - microservices-network

  # Databases
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: products
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - microservices-network

  mongodb:
    image: mongo:6
    environment:
      MONGO_INITDB_DATABASE: users
    volumes:
      - mongodb_data:/data/db
    networks:
      - microservices-network

  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: orders
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - microservices-network

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - microservices-network

  # Message Queue
  rabbitmq:
    image: rabbitmq:3-management
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: password
    ports:
      - "15672:15672" # Management UI
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - microservices-network

  kafka:
    image: confluentinc/cp-kafka:latest
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    depends_on:
      - zookeeper
    networks:
      - microservices-network

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    networks:
      - microservices-network

volumes:
  postgres_data:
  mongodb_data:
  mysql_data:
  redis_data:
  rabbitmq_data:

networks:
  microservices-network:
    driver: bridge
```

## ☸️ Kubernetes Deployment

### Namespace and ConfigMap

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: microservices
  labels:
    name: microservices
    istio-injection: enabled

---
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: microservices
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  API_GATEWAY_URL: "http://api-gateway:8080"
  RABBITMQ_URL: "amqp://rabbitmq:5672"
  KAFKA_BROKERS: "kafka:9092"
```

### Service Deployment Example

```yaml
# user-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: microservices
  labels:
    app: user-service
    version: v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
        version: v1
    spec:
      containers:
      - name: user-service
        image: stephanelkhoury/user-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: NODE_ENV
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: mongodb-credentials
              key: uri
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        securityContext:
          allowPrivilegeEscalation: false
          runAsNonRoot: true
          runAsUser: 1001
          capabilities:
            drop:
              - ALL

---
apiVersion: v1
kind: Service
metadata:
  name: user-service
  namespace: microservices
  labels:
    app: user-service
spec:
  selector:
    app: user-service
  ports:
  - port: 80
    targetPort: 3000
    name: http
  type: ClusterIP

---
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: user-service-hpa
  namespace: microservices
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: user-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Istio Service Mesh Configuration

```yaml
# istio-gateway.yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: microservices-gateway
  namespace: microservices
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - api.microservices.local
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: microservices-tls
    hosts:
    - api.microservices.local

---
# virtual-service.yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: microservices-vs
  namespace: microservices
spec:
  hosts:
  - api.microservices.local
  gateways:
  - microservices-gateway
  http:
  - match:
    - uri:
        prefix: /api/users
    route:
    - destination:
        host: user-service
        port:
          number: 80
      weight: 100
    fault:
      delay:
        percentage:
          value: 0.1
        fixedDelay: 5s
    retries:
      attempts: 3
      perTryTimeout: 10s
  - match:
    - uri:
        prefix: /api/products
    route:
    - destination:
        host: product-service
        port:
          number: 80

---
# destination-rule.yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: user-service-dr
  namespace: microservices
spec:
  host: user-service
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 50
        maxRequestsPerConnection: 10
    circuitBreaker:
      consecutiveErrors: 3
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
    outlierDetection:
      consecutive5xxErrors: 3
      interval: 30s
      baseEjectionTime: 30s
```

## 🔧 Infrastructure as Code

### Terraform AWS EKS Setup

```hcl
# main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.10"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Configuration
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "${var.cluster_name}-vpc"
  cidr = var.vpc_cidr
  
  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs
  
  enable_nat_gateway = true
  enable_vpn_gateway = false
  
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
  }
}

# EKS Cluster
module "eks" {
  source = "terraform-aws-modules/eks/aws"
  
  cluster_name    = var.cluster_name
  cluster_version = var.kubernetes_version
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  
  # Cluster endpoint configuration
  cluster_endpoint_private_access = true
  cluster_endpoint_public_access  = true
  cluster_endpoint_public_access_cidrs = ["0.0.0.0/0"]
  
  # EKS Managed Node Groups
  eks_managed_node_groups = {
    main = {
      min_size     = 3
      max_size     = 10
      desired_size = 6
      
      instance_types = ["t3.medium"]
      capacity_type  = "ON_DEMAND"
      
      k8s_labels = {
        Environment = var.environment
        NodeGroup   = "main"
      }
      
      update_config = {
        max_unavailable_percentage = 25
      }
    }
  }
  
  # Cluster security group rules
  cluster_security_group_additional_rules = {
    egress_nodes_ephemeral_ports_tcp = {
      description                = "To node 1025-65535"
      protocol                   = "tcp"
      from_port                  = 1025
      to_port                    = 65535
      type                       = "egress"
      source_node_security_group = true
    }
  }
  
  tags = {
    Environment = var.environment
    Terraform   = "true"
  }
}

# Install essential cluster addons
resource "helm_release" "aws_load_balancer_controller" {
  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  namespace  = "kube-system"
  version    = "1.5.4"
  
  set {
    name  = "clusterName"
    value = module.eks.cluster_id
  }
  
  set {
    name  = "serviceAccount.create"
    value = "true"
  }
  
  set {
    name  = "serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
    value = aws_iam_role.aws_load_balancer_controller.arn
  }
  
  depends_on = [module.eks]
}

# Istio Installation
resource "helm_release" "istio_base" {
  name       = "istio-base"
  repository = "https://istio-release.storage.googleapis.com/charts"
  chart      = "base"
  namespace  = "istio-system"
  version    = "1.18.2"
  
  create_namespace = true
  
  depends_on = [module.eks]
}

resource "helm_release" "istiod" {
  name       = "istiod"
  repository = "https://istio-release.storage.googleapis.com/charts"
  chart      = "istiod"
  namespace  = "istio-system"
  version    = "1.18.2"
  
  depends_on = [helm_release.istio_base]
}
```

### Helm Chart for Microservices

```yaml
# Chart.yaml
apiVersion: v2
name: microservices-platform
description: A Helm chart for microservices platform
type: application
version: 0.1.0
appVersion: "1.0"

dependencies:
  - name: postgresql
    version: 11.9.13
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled
  - name: mongodb
    version: 13.15.1
    repository: https://charts.bitnami.com/bitnami
    condition: mongodb.enabled
  - name: redis
    version: 17.11.3
    repository: https://charts.bitnami.com/bitnami
    condition: redis.enabled
```

```yaml
# values.yaml
global:
  imageRegistry: ""
  storageClass: "gp2"
  
# Individual service configurations
userService:
  enabled: true
  replicaCount: 3
  image:
    repository: stephanelkhoury/user-service
    tag: "latest"
    pullPolicy: IfNotPresent
  service:
    type: ClusterIP
    port: 80
  autoscaling:
    enabled: true
    minReplicas: 3
    maxReplicas: 10
    targetCPUUtilizationPercentage: 70
  resources:
    limits:
      cpu: 500m
      memory: 512Mi
    requests:
      cpu: 250m
      memory: 256Mi

productService:
  enabled: true
  replicaCount: 3
  image:
    repository: stephanelkhoury/product-service
    tag: "latest"
    pullPolicy: IfNotPresent

# Database configurations
postgresql:
  enabled: true
  auth:
    postgresPassword: "strongpassword"
    database: "products"
  primary:
    persistence:
      enabled: true
      size: 8Gi

mongodb:
  enabled: true
  auth:
    enabled: false
  persistence:
    enabled: true
    size: 8Gi

redis:
  enabled: true
  auth:
    enabled: false
  master:
    persistence:
      enabled: true
      size: 8Gi

# Monitoring stack
monitoring:
  prometheus:
    enabled: true
  grafana:
    enabled: true
    adminPassword: "admin"
  jaeger:
    enabled: true

# Ingress configuration
ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  hosts:
    - host: api.microservices.local
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: microservices-tls
      hosts:
        - api.microservices.local
```

## 📊 Monitoring & Observability

### Prometheus Configuration

```yaml
# prometheus-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitoring
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
    
    rule_files:
      - "/etc/prometheus/rules/*.yml"
    
    alerting:
      alertmanagers:
        - static_configs:
            - targets:
              - alertmanager:9093
    
    scrape_configs:
      # Kubernetes API server
      - job_name: 'kubernetes-apiservers'
        kubernetes_sd_configs:
        - role: endpoints
        scheme: https
        tls_config:
          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
        relabel_configs:
        - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
          action: keep
          regex: default;kubernetes;https
      
      # Kubernetes nodes
      - job_name: 'kubernetes-nodes'
        kubernetes_sd_configs:
        - role: node
        scheme: https
        tls_config:
          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
        relabel_configs:
        - action: labelmap
          regex: __meta_kubernetes_node_label_(.+)
      
      # Kubernetes pods
      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
        - role: pod
        relabel_configs:
        - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
          action: keep
          regex: true
        - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
          action: replace
          target_label: __metrics_path__
          regex: (.+)
        - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
          action: replace
          regex: ([^:]+)(?::\d+)?;(\d+)
          replacement: $1:$2
          target_label: __address__
        - action: labelmap
          regex: __meta_kubernetes_pod_label_(.+)
        - source_labels: [__meta_kubernetes_namespace]
          action: replace
          target_label: kubernetes_namespace
        - source_labels: [__meta_kubernetes_pod_name]
          action: replace
          target_label: kubernetes_pod_name

      # Microservices
      - job_name: 'user-service'
        static_configs:
        - targets: ['user-service:3000']
        metrics_path: /metrics
        scrape_interval: 10s
      
      - job_name: 'product-service'
        static_configs:
        - targets: ['product-service:8000']
        metrics_path: /metrics
        scrape_interval: 10s
      
      - job_name: 'order-service'
        static_configs:
        - targets: ['order-service:8080']
        metrics_path: /actuator/prometheus
        scrape_interval: 10s
```

### Grafana Dashboard Configuration

```json
{
  "dashboard": {
    "id": null,
    "title": "Microservices Overview",
    "tags": ["microservices", "kubernetes"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total[5m])) by (service)",
            "legendFormat": "{{service}}"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 0}
      },
      {
        "id": 2,
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))",
            "legendFormat": "95th percentile - {{service}}"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 0}
      },
      {
        "id": 3,
        "title": "Error Rate",
        "type": "singlestat",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m]))",
            "legendFormat": "Error Rate"
          }
        ],
        "gridPos": {"h": 4, "w": 6, "x": 0, "y": 8}
      }
    ],
    "time": {"from": "now-1h", "to": "now"},
    "refresh": "5s"
  }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/microservices-ci-cd.yml
name: Microservices CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'services/**'
      - 'k8s/**'
      - 'helm/**'
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: stephanelkhoury/microservices

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      services: ${{ steps.changes.outputs.services }}
    steps:
    - uses: actions/checkout@v3
    - uses: dorny/paths-filter@v2
      id: changes
      with:
        filters: |
          user-service:
            - 'services/user-service/**'
          product-service:
            - 'services/product-service/**'
          order-service:
            - 'services/order-service/**'
          payment-service:
            - 'services/payment-service/**'

  build-and-test:
    needs: detect-changes
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: ${{ fromJSON(needs.detect-changes.outputs.services) }}
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-${{ matrix.service }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: ./services/${{ matrix.service }}
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
    
    - name: Run tests
      run: |
        cd services/${{ matrix.service }}
        if [ -f "docker-compose.test.yml" ]; then
          docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
          docker-compose -f docker-compose.test.yml down
        fi

  security-scan:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
        format: 'sarif'
        output: 'trivy-results.sarif'
    
    - name: Upload Trivy scan results
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'

  deploy-staging:
    needs: [build-and-test, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-west-2
    
    - name: Update kubeconfig
      run: aws eks update-kubeconfig --name microservices-staging --region us-west-2
    
    - name: Deploy with Helm
      run: |
        helm upgrade --install microservices-staging ./helm/microservices-platform \
          --namespace staging \
          --create-namespace \
          --set global.imageTag=${{ github.sha }} \
          --set global.environment=staging \
          --values ./helm/values-staging.yaml \
          --wait --timeout=10m

  deploy-production:
    needs: [build-and-test, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-west-2
    
    - name: Update kubeconfig
      run: aws eks update-kubeconfig --name microservices-prod --region us-west-2
    
    - name: Deploy with Helm
      run: |
        helm upgrade --install microservices-prod ./helm/microservices-platform \
          --namespace production \
          --create-namespace \
          --set global.imageTag=${{ github.sha }} \
          --set global.environment=production \
          --values ./helm/values-production.yaml \
          --wait --timeout=15m
    
    - name: Run smoke tests
      run: |
        kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=microservices-prod -n production --timeout=300s
        ./scripts/smoke-tests.sh production
```

## 🧪 Testing Strategy

### Microservice Testing

```typescript
// Integration test example for User Service
import request from 'supertest';
import { app } from '../src/app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('User Service Integration Tests', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.password).toBeUndefined();
    });

    it('should reject invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        name: 'Test User',
        password: 'password123'
      };

      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);
    });
  });

  describe('GET /health', () => {
    it('should return service health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.service).toBe('user-service');
    });
  });
});
```

### Contract Testing with Pact

```typescript
// Contract test for User Service consumer
import { Pact } from '@pact-foundation/pact';
import { like, eachLike } from '@pact-foundation/pact/src/common/matchers';
import axios from 'axios';

describe('Product Service - User Service Contract', () => {
  const provider = new Pact({
    consumer: 'product-service',
    provider: 'user-service',
    port: 1234,
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: 'INFO'
  });

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  describe('getting user details', () => {
    it('should return user when valid ID is provided', async () => {
      await provider.addInteraction({
        state: 'user with ID 123 exists',
        uponReceiving: 'a request for user details',
        withRequest: {
          method: 'GET',
          path: '/api/users/123',
          headers: {
            'Authorization': like('Bearer token')
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            id: like('123'),
            email: like('user@example.com'),
            name: like('John Doe'),
            createdAt: like('2023-01-01T00:00:00Z')
          }
        }
      });

      const response = await axios.get('http://localhost:1234/api/users/123', {
        headers: { Authorization: 'Bearer token' }
      });

      expect(response.data.id).toBe('123');
      expect(response.data.email).toBe('user@example.com');
    });
  });
});
```

## 📈 Implementation Phases

### Phase 1: Foundation Setup (Week 1-4)
- Set up development environment with Docker Compose
- Create individual microservice foundations
- Implement basic CRUD operations for each service
- Set up inter-service communication patterns

### Phase 2: Container & Orchestration (Week 5-8)
- Containerize all services with optimized Dockerfiles
- Set up Kubernetes cluster (local and cloud)
- Create Kubernetes manifests and Helm charts
- Implement service discovery and load balancing

### Phase 3: Service Mesh & Security (Week 9-12)
- Deploy Istio service mesh
- Implement circuit breakers and retry policies
- Add authentication and authorization
- Set up network policies and security contexts

### Phase 4: Monitoring & Observability (Week 13-16)
- Deploy Prometheus and Grafana
- Implement distributed tracing with Jaeger
- Set up centralized logging with ELK stack
- Create comprehensive dashboards and alerts

### Phase 5: CI/CD & Infrastructure (Week 17-20)
- Set up GitOps with ArgoCD
- Implement infrastructure as code with Terraform
- Create automated testing pipelines
- Deploy production-ready clusters

### Phase 6: Advanced Features (Week 21-26)
- Implement auto-scaling and resource optimization
- Add chaos engineering practices
- Set up disaster recovery procedures
- Optimize performance and cost management

## 🎓 Learning Outcomes

### Cloud-Native Architecture
- **Microservices Design**: Service decomposition and domain boundaries
- **Container Orchestration**: Kubernetes concepts and best practices
- **Service Mesh**: Inter-service communication and traffic management
- **Infrastructure as Code**: Terraform and GitOps principles
- **DevOps Culture**: Automation, monitoring, and continuous improvement

### Production Operations
- **Observability**: Metrics, logging, and distributed tracing
- **Scalability**: Auto-scaling and performance optimization
- **Reliability**: Circuit breakers, retries, and fault tolerance
- **Security**: Container and cluster security best practices
- **Cost Management**: Resource optimization and monitoring

## 📞 Contact & Collaboration

**Developer**: Stephane Elkhoury  
**Email**: stephanelkhoury.dev@gmail.com  
**Portfolio**: [stephanelkhoury.com](https://stephanelkhoury.com)  
**GitHub**: [@stephanelkhoury](https://github.com/stephanelkhoury)

---

*This project demonstrates enterprise-grade cloud-native architecture, advanced container orchestration, and production-ready microservices patterns while showcasing modern DevOps practices and infrastructure automation.*
