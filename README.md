Descripción
Aplicación FullStack para el proceso de onboarding de pagos. Permite a los usuarios:

Ver productos disponibles en stock.

Pagar con tarjeta de crédito (VISA/MasterCard).

Ingresar datos de envío.

Confirmar el pago y recibir el estado de la transacción.

Actualizar el stock automáticamente.

Tecnologías
Frontend	Backend	Base de Datos	Infraestructura
React (TypeScript)	Node.js (TypeScript)	PostgreSQL	AWS Amplify (Front)
Redux (State)	NestJS		EC2 (Back + DB)
CSS Grid/Flexbox	Jest (Tests)		
Requisitos
Node.js ≥ 18.x

PostgreSQL ≥ 14.x

AWS CLI (para despliegue)

Instalación
1. Clonar el repositorio
bash
git clone https://github.com/DavidDupre/ecommerce.git
cd backend o frontend
2. Configurar Backend
bash
cd backend
npm install
Variables de Entorno (.env)
env
DB_HOST=tu-instancia-ec2.rds.amazonaws.com
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu-contraseña
DB_NAME=payment_db
PAYMENT_API_KEY=clave_privada_de_sandbox
PAYMENT_API_URL=https://api-sandbox.payment-gateway.com/v1
Ejecutar Backend
bash
npm run start:dev  # Modo desarrollo
npm run test       # Ejecutar tests (80%+ coverage)
3. Configurar Frontend
bash
cd ../frontend
npm install
Variables de Entorno (.env)
env
REACT_APP_API_URL=http:http://ec2-54-210-169-255.compute-1.amazonaws.com:3000
REACT_APP_PAYMENT_PUBLIC_KEY=clave_publica_de_sandbox
Ejecutar Frontend
bash
npm start  # Modo desarrollo
npm test   # Ejecutar tests
Despliegue en AWS
Frontend (AWS Amplify)
Conectar repositorio GitHub a Amplify.

Configurar build:

bash
npm install && npm run build
Habilitar despliegue automático en main.

Backend + DB (EC2)
Instalar Node.js, PostgreSQL y PM2 en EC2.

Clonar el repositorio cd /backend.

Configurar PostgreSQL en RDS (EC2).

Iniciar servicio con PM2:

bash
pm2 start npm --name "backend" -- run start:prod
Estructura del Proyecto
Backend (NestJS - Hexagonal Architecture)
text
backend/  
├── src/  
│   ├── core/            # Lógica de negocio  
│   ├── infrastructure/  # DB, APIs externas  
│   ├── interfaces/      # Controladores y DTOs  
│   └── shared/          # Utilerías  
├── test/                # Tests unitarios  
└── .env                 # Variables de entorno  
Frontend (React + Redux)
text
frontend/  
├── src/  
│   ├── components/      # UI (Producto, Pago, Resumen)  
│   ├── store/           # Redux (transacciones, stock)  
│   ├── services/        # API calls  
│   └── hooks/           # Custom hooks  
├── public/              # Assets  
└── .env                 # Variables de entorno  
Endpoints (Swagger)
GET /products: Listar productos en stock.

POST /transactions: Crear transacción PENDING.

GET /transactions/:id: Ver detalle de transacción.

Demo
🌐 Frontend: https://main.d1yixiw7e2sukl.amplifyapp.com/products/
🔗 Backend: http://ec2-54-210-169-255.compute-1.amazonaws.com:3000
