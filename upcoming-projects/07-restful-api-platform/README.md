# 🔗 RESTful API Platform

> Comprehensive API development platform with automatic documentation, testing tools, rate limiting, analytics, and developer portal for building and managing REST APIs.

## 📊 Project Overview

- **Status**: ✅ Completed
- **Timeline**: Q3 2024 - June 2025 (3-4 months)
- **Complexity**: ⭐⭐⭐ Intermediate
- **Type**: Backend Platform & Developer Tools

## 🎯 Project Description

Build a robust RESTful API platform that simplifies API development, testing, and management. Features automatic OpenAPI documentation generation, integrated testing tools, API analytics, rate limiting, and a comprehensive developer portal for API consumers.

## ✨ Key Features

### API Development Framework
- **Code Generation**: Auto-generate API boilerplate from OpenAPI specs
- **Schema Validation**: Automatic request/response validation
- **Middleware System**: Extensible middleware for authentication, logging, etc.
- **Database Integration**: ORM/ODM integration with multiple databases
- **Error Handling**: Standardized error responses and logging
- **Versioning Support**: API version management and backwards compatibility

### Documentation & Testing
- **OpenAPI Integration**: Automatic Swagger/OpenAPI 3.0 generation
- **Interactive Docs**: Built-in API explorer and testing interface
- **Postman Integration**: Auto-generated Postman collections
- **Mock Server**: Generate mock responses from API specifications
- **Testing Suite**: Automated API testing with coverage reports
- **Code Examples**: Multi-language SDK generation

### API Management
- **Rate Limiting**: Flexible rate limiting with multiple strategies
- **API Keys**: Authentication and authorization management
- **Analytics Dashboard**: API usage statistics and performance metrics
- **Monitoring**: Real-time API health and performance monitoring
- **Caching**: Intelligent response caching strategies
- **Load Balancing**: Horizontal scaling and traffic distribution

### Developer Portal
- **API Catalog**: Browsable API directory
- **Developer Onboarding**: Registration and API key management
- **Usage Dashboard**: Developer analytics and quotas
- **Support System**: Integrated ticketing and documentation
- **Community Features**: Forums and feedback systems
- **Billing Integration**: Usage-based billing and subscription management

## 🛠 Technical Stack

### Backend Core
- **Framework**: Node.js with Express.js + TypeScript
- **Validation**: Joi + express-validator
- **Documentation**: Swagger UI + OpenAPI 3.0
- **Testing**: Jest + Supertest + Newman
- **ORM**: Prisma or TypeORM

### Database & Cache
- **Primary DB**: PostgreSQL
- **Cache**: Redis for rate limiting and caching
- **Search**: Elasticsearch for API discovery
- **Analytics**: ClickHouse for usage analytics
- **Queue**: Bull/BullMQ for background jobs

### Infrastructure
- **API Gateway**: NGINX with custom modules
- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston + ELK Stack
- **Documentation**: GitBook or custom React app
- **Container**: Docker + Docker Compose

### Frontend Dashboard
- **Framework**: React 18 with TypeScript
- **UI Library**: Ant Design or Mantine
- **Charts**: Recharts + D3.js
- **Code Editor**: Monaco Editor for API testing
- **State Management**: Redux Toolkit

## 🗄 Database Schema

```sql
-- API Management
CREATE TABLE apis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(50) NOT NULL,
    base_url VARCHAR(500) NOT NULL,
    openapi_spec JSONB NOT NULL,
    status api_status DEFAULT 'development',
    owner_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    
    -- Configuration
    rate_limit_per_minute INTEGER DEFAULT 100,
    rate_limit_per_hour INTEGER DEFAULT 1000,
    rate_limit_per_day INTEGER DEFAULT 10000,
    cache_ttl_seconds INTEGER DEFAULT 300,
    requires_auth BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    tags TEXT[],
    categories TEXT[],
    is_public BOOLEAN DEFAULT FALSE,
    documentation_url TEXT,
    support_email VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- API Keys & Authentication
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_id VARCHAR(64) UNIQUE NOT NULL, -- Public identifier
    key_hash VARCHAR(255) NOT NULL, -- Hashed secret key
    name VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id),
    api_id UUID REFERENCES apis(id),
    
    -- Permissions & Limits
    scopes TEXT[], -- Array of allowed operations
    rate_limit_override JSONB, -- Custom rate limits
    ip_whitelist INET[],
    
    -- Status & Metadata
    status key_status DEFAULT 'active',
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- API Usage Analytics
CREATE TABLE api_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_id UUID REFERENCES apis(id),
    api_key_id UUID REFERENCES api_keys(id),
    
    -- Request Details
    method VARCHAR(10) NOT NULL,
    endpoint VARCHAR(1000) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER NOT NULL,
    request_size_bytes INTEGER,
    response_size_bytes INTEGER,
    
    -- Client Information
    ip_address INET,
    user_agent TEXT,
    referer TEXT,
    
    -- Geographic Data
    country_code VARCHAR(2),
    city VARCHAR(100),
    
    -- Error Information
    error_type VARCHAR(100),
    error_message TEXT,
    
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Documentation & Examples
CREATE TABLE api_endpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_id UUID REFERENCES apis(id),
    method VARCHAR(10) NOT NULL,
    path VARCHAR(1000) NOT NULL,
    summary VARCHAR(255),
    description TEXT,
    
    -- OpenAPI Schema
    parameters JSONB,
    request_body JSONB,
    responses JSONB,
    
    -- Examples & Testing
    example_requests JSONB,
    example_responses JSONB,
    test_cases JSONB,
    
    -- Metadata
    tags TEXT[],
    deprecated BOOLEAN DEFAULT FALSE,
    internal_only BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Developer Portal
CREATE TABLE developer_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    website_url TEXT,
    redirect_urls TEXT[],
    
    -- API Access
    subscribed_apis UUID[], -- Array of API IDs
    approval_status approval_status DEFAULT 'pending',
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE api_status AS ENUM ('development', 'testing', 'production', 'deprecated');
CREATE TYPE key_status AS ENUM ('active', 'suspended', 'revoked', 'expired');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
```

## 🔌 API Design

### Platform Management API

```typescript
// API CRUD Operations
POST   /api/v1/apis                    // Create new API
GET    /api/v1/apis                    // List APIs with filtering
GET    /api/v1/apis/:id                // Get API details
PUT    /api/v1/apis/:id                // Update API
DELETE /api/v1/apis/:id                // Delete API
POST   /api/v1/apis/:id/deploy         // Deploy API to environment

// OpenAPI Specification Management
GET    /api/v1/apis/:id/spec           // Get OpenAPI specification
PUT    /api/v1/apis/:id/spec           // Update OpenAPI specification
POST   /api/v1/apis/:id/validate       // Validate API specification
GET    /api/v1/apis/:id/docs           // Get generated documentation

// API Key Management
POST   /api/v1/api-keys                // Create API key
GET    /api/v1/api-keys                // List user's API keys
GET    /api/v1/api-keys/:id            // Get API key details
PUT    /api/v1/api-keys/:id            // Update API key
DELETE /api/v1/api-keys/:id            // Revoke API key
POST   /api/v1/api-keys/:id/regenerate // Regenerate API key

// Analytics & Monitoring
GET    /api/v1/apis/:id/analytics      // Get API usage analytics
GET    /api/v1/apis/:id/metrics        // Get performance metrics
GET    /api/v1/apis/:id/logs           // Get API access logs
GET    /api/v1/analytics/dashboard     // Overall analytics dashboard

// Testing & Mocking
POST   /api/v1/apis/:id/test           // Run API tests
GET    /api/v1/apis/:id/mock           // Start mock server
POST   /api/v1/apis/:id/postman        // Generate Postman collection
```

### Dynamic API Router

```typescript
import express from 'express';
import { OpenAPIV3 } from 'openapi-types';
import { validateRequest, authenticateApiKey, rateLimit } from '../middleware';

export class DynamicAPIRouter {
  private app: express.Application;
  
  constructor(app: express.Application) {
    this.app = app;
  }
  
  /**
   * Dynamically register API routes from OpenAPI specification
   */
  public registerAPIRoutes(apiId: string, spec: OpenAPIV3.Document) {
    const basePath = `/api/dynamic/${apiId}`;
    
    // Create router for this API
    const router = express.Router();
    
    // Apply middleware
    router.use(authenticateApiKey(apiId));
    router.use(rateLimit(apiId));
    
    // Register each path from OpenAPI spec
    Object.entries(spec.paths || {}).forEach(([path, pathItem]) => {
      if (!pathItem) return;
      
      Object.entries(pathItem).forEach(([method, operation]) => {
        if (typeof operation !== 'object' || !operation.operationId) return;
        
        const routePath = path.replace(/{([^}]+)}/g, ':$1'); // Convert {id} to :id
        
        router[method.toLowerCase() as keyof express.Router](
          routePath,
          validateRequest(operation),
          this.createRouteHandler(apiId, operation.operationId)
        );
      });
    });
    
    // Mount router
    this.app.use(basePath, router);
  }
  
  private createRouteHandler(apiId: string, operationId: string) {
    return async (req: express.Request, res: express.Response) => {
      try {
        // Log request
        await this.logAPIRequest(apiId, req);
        
        // Get custom handler or use default
        const handler = await this.getOperationHandler(apiId, operationId);
        
        if (handler) {
          const result = await handler(req);
          res.json(result);
        } else {
          // Return mock response based on OpenAPI spec
          const mockResponse = await this.generateMockResponse(apiId, operationId);
          res.json(mockResponse);
        }
      } catch (error) {
        await this.logAPIError(apiId, req, error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
  }
}
```

## 🎨 Developer Portal Interface

### API Dashboard Component

```typescript
import React, { useState, useEffect } from 'react';
import { Card, Statistic, Table, Button, Modal, Form, Input } from 'antd';
import { LineChart, BarChart, PieChart } from 'recharts';
import { ApiOutlined, KeyOutlined, EyeOutlined } from '@ant-design/icons';

interface APIDashboardProps {
  apiId: string;
}

export const APIDashboard: React.FC<APIDashboardProps> = ({ apiId }) => {
  const [apiData, setApiData] = useState<APIData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isCreateKeyModalVisible, setIsCreateKeyModalVisible] = useState(false);

  useEffect(() => {
    fetchAPIData();
    fetchAnalytics();
  }, [apiId]);

  const fetchAPIData = async () => {
    const response = await fetch(`/api/v1/apis/${apiId}`);
    const data = await response.json();
    setApiData(data);
  };

  const fetchAnalytics = async () => {
    const response = await fetch(`/api/v1/apis/${apiId}/analytics`);
    const data = await response.json();
    setAnalytics(data);
  };

  return (
    <div className="space-y-6">
      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Statistic
            title="Total Requests"
            value={analytics?.totalRequests || 0}
            prefix={<ApiOutlined />}
          />
        </Card>
        <Card>
          <Statistic
            title="Success Rate"
            value={analytics?.successRate || 0}
            suffix="%"
            precision={2}
          />
        </Card>
        <Card>
          <Statistic
            title="Avg Response Time"
            value={analytics?.avgResponseTime || 0}
            suffix="ms"
          />
        </Card>
        <Card>
          <Statistic
            title="Active API Keys"
            value={analytics?.activeKeys || 0}
            prefix={<KeyOutlined />}
          />
        </Card>
      </div>

      {/* Usage Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Request Volume Over Time">
          <LineChart
            width={500}
            height={300}
            data={analytics?.requestsOverTime || []}
          >
            {/* Chart configuration */}
          </LineChart>
        </Card>

        <Card title="Response Status Distribution">
          <PieChart
            width={500}
            height={300}
            data={analytics?.statusDistribution || []}
          >
            {/* Chart configuration */}
          </PieChart>
        </Card>
      </div>

      {/* API Keys Management */}
      <Card 
        title="API Keys" 
        extra={
          <Button 
            type="primary" 
            onClick={() => setIsCreateKeyModalVisible(true)}
          >
            Create API Key
          </Button>
        }
      >
        <Table
          dataSource={apiData?.apiKeys || []}
          columns={[
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Key ID', dataIndex: 'keyId', key: 'keyId' },
            { title: 'Status', dataIndex: 'status', key: 'status' },
            { title: 'Last Used', dataIndex: 'lastUsed', key: 'lastUsed' },
            { title: 'Actions', key: 'actions', render: () => (
              <Button icon={<EyeOutlined />} size="small">View</Button>
            )}
          ]}
        />
      </Card>

      {/* Create API Key Modal */}
      <Modal
        title="Create API Key"
        visible={isCreateKeyModalVisible}
        onCancel={() => setIsCreateKeyModalVisible(false)}
        footer={null}
      >
        <CreateAPIKeyForm 
          apiId={apiId}
          onSuccess={() => {
            setIsCreateKeyModalVisible(false);
            fetchAPIData();
          }}
        />
      </Modal>
    </div>
  );
};
```

### Interactive API Documentation

```typescript
import React, { useState } from 'react';
import { OpenAPIV3 } from 'openapi-types';
import MonacoEditor from '@monaco-editor/react';
import { Button, Select, Input, Tabs } from 'antd';

interface APIExplorerProps {
  apiSpec: OpenAPIV3.Document;
  baseUrl: string;
}

export const APIExplorer: React.FC<APIExplorerProps> = ({ apiSpec, baseUrl }) => {
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [requestBody, setRequestBody] = useState<string>('{}');
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const executeRequest = async () => {
    setIsLoading(true);
    try {
      const url = `${baseUrl}${selectedPath}`;
      const options: RequestInit = {
        method: selectedMethod.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('apiKey')}`
        }
      };

      if (['POST', 'PUT', 'PATCH'].includes(selectedMethod.toUpperCase())) {
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const data = await res.json();
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: data
      });
    } catch (error) {
      setResponse({
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateCodeExample = (language: string) => {
    const examples = {
      javascript: `
fetch('${baseUrl}${selectedPath}', {
  method: '${selectedMethod.toUpperCase()}',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(${requestBody})
})
.then(response => response.json())
.then(data => console.log(data));
      `,
      python: `
import requests

response = requests.${selectedMethod.toLowerCase()}(
    '${baseUrl}${selectedPath}',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
    },
    json=${requestBody}
)
print(response.json())
      `,
      curl: `
curl -X ${selectedMethod.toUpperCase()} \\
  '${baseUrl}${selectedPath}' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -d '${requestBody}'
      `
    };
    
    return examples[language] || '';
  };

  return (
    <div className="api-explorer">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Panel */}
        <div className="request-panel">
          <h3>Make a Request</h3>
          
          <div className="mb-4">
            <label>Endpoint:</label>
            <Select
              style={{ width: '100%' }}
              placeholder="Select an endpoint"
              onChange={(value) => setSelectedPath(value)}
            >
              {Object.keys(apiSpec.paths || {}).map(path => (
                <Select.Option key={path} value={path}>
                  {path}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className="mb-4">
            <label>Method:</label>
            <Select
              style={{ width: '100%' }}
              placeholder="Select HTTP method"
              onChange={(value) => setSelectedMethod(value)}
            >
              {selectedPath && apiSpec.paths?.[selectedPath] &&
                Object.keys(apiSpec.paths[selectedPath]).map(method => (
                  <Select.Option key={method} value={method}>
                    {method.toUpperCase()}
                  </Select.Option>
                ))
              }
            </Select>
          </div>

          <div className="mb-4">
            <label>Request Body:</label>
            <MonacoEditor
              height="200px"
              language="json"
              value={requestBody}
              onChange={(value) => setRequestBody(value || '{}')}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false
              }}
            />
          </div>

          <Button 
            type="primary" 
            onClick={executeRequest}
            loading={isLoading}
            disabled={!selectedPath || !selectedMethod}
          >
            Send Request
          </Button>
        </div>

        {/* Response Panel */}
        <div className="response-panel">
          <Tabs defaultActiveKey="response">
            <Tabs.TabPane tab="Response" key="response">
              {response && (
                <div>
                  <div className="mb-2">
                    <strong>Status:</strong> {response.status} {response.statusText}
                  </div>
                  <MonacoEditor
                    height="400px"
                    language="json"
                    value={JSON.stringify(response.body || response, null, 2)}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false }
                    }}
                  />
                </div>
              )}
            </Tabs.TabPane>
            
            <Tabs.TabPane tab="Code Examples" key="examples">
              <Tabs type="card">
                <Tabs.TabPane tab="JavaScript" key="js">
                  <MonacoEditor
                    height="300px"
                    language="javascript"
                    value={generateCodeExample('javascript')}
                    options={{ readOnly: true }}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Python" key="python">
                  <MonacoEditor
                    height="300px"
                    language="python"
                    value={generateCodeExample('python')}
                    options={{ readOnly: true }}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab="cURL" key="curl">
                  <MonacoEditor
                    height="300px"
                    language="shell"
                    value={generateCodeExample('curl')}
                    options={{ readOnly: true }}
                  />
                </Tabs.TabPane>
              </Tabs>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
```

## 🧪 Testing Strategy

### API Testing Suite

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { APIService } from '../services/api.service';

describe('API Management (e2e)', () => {
  let app: INestApplication;
  let apiService: APIService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    apiService = moduleFixture.get<APIService>(APIService);
    await app.init();
  });

  describe('/apis (POST)', () => {
    it('should create a new API', () => {
      const createApiDto = {
        name: 'Test API',
        description: 'A test API',
        version: '1.0.0',
        openapi_spec: {
          openapi: '3.0.0',
          info: { title: 'Test API', version: '1.0.0' },
          paths: {}
        }
      };

      return request(app.getHttpServer())
        .post('/apis')
        .send(createApiDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe(createApiDto.name);
          expect(res.body.id).toBeDefined();
        });
    });

    it('should validate OpenAPI specification', () => {
      const invalidSpec = {
        name: 'Invalid API',
        openapi_spec: {
          invalid: 'spec'
        }
      };

      return request(app.getHttpServer())
        .post('/apis')
        .send(invalidSpec)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Invalid OpenAPI specification');
        });
    });
  });

  describe('API Key Authentication', () => {
    let apiId: string;
    let apiKey: string;

    beforeEach(async () => {
      // Create test API
      const api = await apiService.create({
        name: 'Test API',
        version: '1.0.0',
        openapi_spec: mockOpenAPISpec
      });
      apiId = api.id;

      // Create API key
      const keyResponse = await request(app.getHttpServer())
        .post('/api-keys')
        .send({
          name: 'Test Key',
          api_id: apiId
        })
        .expect(201);

      apiKey = keyResponse.body.key;
    });

    it('should authenticate valid API key', () => {
      return request(app.getHttpServer())
        .get(`/api/dynamic/${apiId}/test`)
        .set('Authorization', `Bearer ${apiKey}`)
        .expect(200);
    });

    it('should reject invalid API key', () => {
      return request(app.getHttpServer())
        .get(`/api/dynamic/${apiId}/test`)
        .set('Authorization', 'Bearer invalid-key')
        .expect(401);
    });

    it('should apply rate limiting', async () => {
      // Make requests up to limit
      for (let i = 0; i < 100; i++) {
        await request(app.getHttpServer())
          .get(`/api/dynamic/${apiId}/test`)
          .set('Authorization', `Bearer ${apiKey}`)
          .expect(200);
      }

      // Next request should be rate limited
      return request(app.getHttpServer())
        .get(`/api/dynamic/${apiId}/test`)
        .set('Authorization', `Bearer ${apiKey}`)
        .expect(429);
    });
  });
});
```

### Performance Testing

```javascript
// load-test.js - Using Artillery.io
module.exports = {
  config: {
    target: 'http://localhost:3000',
    phases: [
      { duration: 60, arrivalRate: 10 }, // Warm up
      { duration: 300, arrivalRate: 50 }, // Sustained load
      { duration: 60, arrivalRate: 100 } // Peak load
    ],
    defaults: {
      headers: {
        'Authorization': 'Bearer {{ $randomString() }}'
      }
    }
  },
  scenarios: [
    {
      name: 'API Discovery',
      weight: 30,
      flow: [
        { get: { url: '/api/v1/apis' } },
        { get: { url: '/api/v1/apis/{{ $randomString() }}' } }
      ]
    },
    {
      name: 'API Testing',
      weight: 50,
      flow: [
        { post: {
            url: '/api/dynamic/{{ apiId }}/test',
            json: { test: 'data' }
          }
        }
      ]
    },
    {
      name: 'Analytics',
      weight: 20,
      flow: [
        { get: { url: '/api/v1/apis/{{ apiId }}/analytics' } }
      ]
    }
  ]
};
```

## 🚀 Deployment Configuration

### Docker Compose Setup

```yaml
version: '3.8'

services:
  api-platform:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/apiplatform
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./uploads:/app/uploads

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: apiplatform
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api-platform

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  postgres_data:
  redis_data:
  grafana_data:
```

## 📈 Implementation Phases

### Phase 1: Core Platform (Week 1-4)
- Set up Node.js/Express backend with TypeScript
- Implement API CRUD operations
- Create OpenAPI specification handling
- Set up PostgreSQL database and basic models

### Phase 2: Authentication & Security (Week 5-8)
- Implement API key authentication system
- Add rate limiting with Redis
- Create request validation middleware
- Set up audit logging and monitoring

### Phase 3: Dynamic Routing (Week 9-12)
- Build dynamic API router from OpenAPI specs
- Implement request/response validation
- Add mock response generation
- Create custom handler system

### Phase 4: Developer Portal (Week 13-16)
- Build React frontend application
- Create API dashboard and analytics
- Implement interactive API documentation
- Add developer onboarding flow

### Phase 5: Advanced Features (Week 17-20)
- Add comprehensive testing tools
- Implement usage analytics and billing
- Create SDK generation
- Set up monitoring and alerting

## 🎓 Learning Outcomes

### API Development
- **OpenAPI/Swagger**: Specification-driven development
- **API Design**: RESTful principles and best practices
- **Authentication**: API key management and security
- **Rate Limiting**: Traffic control and abuse prevention
- **Documentation**: Auto-generated interactive docs

### Platform Engineering
- **Dynamic Routing**: Runtime route generation
- **Middleware Systems**: Extensible request/response processing
- **Plugin Architecture**: Modular system design
- **Performance Monitoring**: Metrics collection and analysis
- **Developer Experience**: Tools and portal design

## 📞 Contact & Collaboration

**Developer**: Stephane Elkhoury  
**Email**: stephanelkhoury.dev@gmail.com  
**Portfolio**: [stephanelkhoury.com](https://stephanelkhoury.com)  
**GitHub**: [@stephanelkhoury](https://github.com/stephanelkhoury)

---

*This project demonstrates modern API platform development, dynamic routing systems, and comprehensive developer tooling while showcasing enterprise-level API management and documentation techniques.*
