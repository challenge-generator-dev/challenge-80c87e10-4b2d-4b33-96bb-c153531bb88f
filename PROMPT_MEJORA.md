# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | DynamoDB |
| `client` | `client/` | chapter, support | client | React | React |
| `infra` | `infra/` | support | infra | Terraform (AWS) | Terraform |
| `infra-local` | (raiz) | support | infra | Compose local | DynamoDB |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate` — componente `infra` (support).
3. `cd api && npm install && npm run build` — componente `api` (practice).
4. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `POST /orders`
  - `GET /orders/:id`
  - `PUT /orders/:id`
  - `DELETE /orders/:id`
- `client` expone http:

## Herramientas

- **Terraform**: Herramienta de trabajo del candidato: usala en la fase donde se depura o se prueba la solucion (no es una dependencia del proyecto).

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `api/src/application/dtos/create-order.dto.ts` — `ProductDto.forEach`: Se invoca `forEach` sobre `ProductDto`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `client/src/features/orders/components/OrderList.tsx` — `OrderItem.map`: Se invoca `map` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `client/src/mocks/browser.ts` — `MockOrder.find`: Se invoca `find` sobre `MockOrder`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `client/src/mocks/browser.ts` — `MockOrder.findIndex`: Se invoca `findIndex` sobre `MockOrder`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

## Como saber que terminaste

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología React, Advanced L2

### Brecha de conocimiento
CRUD de ordenes en DynamoDB desde la interfaz (corrida e2e 20261109223818458), Implementa operaciones CRUD de ordenes en DynamoDB desde la interfaz y versiona la infraestructura

### Misión / candidato
Gestionar ordenes

### Reto
- Tema: Persistir ordenes en DynamoDB desde la interfaz
- Seniority: advanced-l2
- Tipo: practical
- Título: Implementación CRUD de ordenes en DynamoDB
- Tiempo estimado: 1 semana

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Crear orden — objetivo: Implementar la funcionalidad para crear una nueva orden en DynamoDB. — entregable (NO resolver): Interfaz de usuario funcional para crear ordenes y registro de la orden en DynamoDB.
- Fase 2: Leer orden — objetivo: Implementar la funcionalidad para leer una orden existente en DynamoDB. — entregable (NO resolver): Interfaz de usuario funcional para leer ordenes y consulta en DynamoDB para obtener ordenes por ID.
- Fase 3: Actualizar orden — objetivo: Implementar la funcionalidad para actualizar una orden existente en DynamoDB. — entregable (NO resolver): Interfaz de usuario funcional para actualizar ordenes y lógica para actualizar ordenes en DynamoDB.
- Fase 4: Eliminar orden — objetivo: Implementar la funcionalidad para eliminar una orden existente en DynamoDB. — entregable (NO resolver): Interfaz de usuario funcional para eliminar ordenes y lógica para eliminar ordenes en DynamoDB.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: api/package.json ===
{
  "name": "order-api",
  "version": "1.0.0",
  "description": "API para gestión de órdenes con persistencia en DynamoDB",
  "main": "dist/src/main.js",
  "scripts": {
    "build": "tsc",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "ts-node src/main.ts",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/src/main.js",
    "lint": "eslint \"{src,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.577.0",
    "@aws-sdk/lib-dynamodb": "^3.577.0",
    "@nestjs/common": "^11.0.0",
    "@nestjs/config": "^4.0.4",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/swagger": "^11.4.8",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@nestjs/testing": "^11.0.0",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.12.12",
    "@types/supertest": "^2.0.16",
    "@types/uuid": "^9.0.8",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.3",
    "jest": "^29.7.0",
    "prettier": "^3.2.5",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.2",
    "ts-node": "^10.9.2",
    "typescript": "^5.7.2"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}

// === ARCHIVO: api/tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": ".",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "exclude": ["node_modules", "dist", "test", "**/*.spec.ts"]
}

// === ARCHIVO: api/src/main.ts ===
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Order API')
    .setDescription('API para gestión de órdenes con persistencia en DynamoDB')
    .setVersion('1.0')
    .addTag('orders')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

// === ARCHIVO: api/src/domain/entities/order.entity.ts ===
import { v4 as uuidv4 } from 'uuid';

/**
 * Entidad de dominio que representa una orden de compra con sus atributos.
 * Incluye validaciones de invariantes para asegurar consistencia.
 */
export class OrderEntity {
  readonly id: string;
  readonly customerId: string;
  readonly products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  readonly orderDate: Date;
  status: 'pending' | 'completed' | 'cancelled';
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(
    customerId: string,
    products: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>,
    id?: string,
    status?: 'pending' | 'completed' | 'cancelled',
    orderDate?: Date,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    if (!customerId || customerId.trim() === '') {
      throw new Error('Customer ID is required');
    }
    if (!products || products.length === 0) {
      throw new Error('At least one product is required');
    }
    products.forEach(product => {
      if (!product.productId || product.productId.trim() === '') {
        throw new Error('Product ID is required');
      }
      if (product.quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }
      if (product.price <= 0) {
        throw new Error('Price must be greater than 0');
      }
    });

    this.id = id || uuidv4();
    this.customerId = customerId;
    this.products = products;
    this.orderDate = orderDate || new Date();
    this.status = status || 'pending';
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  /**
   * Calcula el total de la orden sumando el precio de todos los productos.
   */
  get total(): number {
    return this.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  }

  /**
   * Actualiza el estado de la orden y registra la fecha de actualización.
   */
  updateStatus(status: 'pending' | 'completed' | 'cancelled'): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  /**
   * Valida que la orden cumpla con las invariantes del dominio.
   */
  validate(): void {
    if (!this.id || this.id.trim() === '') {
      throw new Error('Order ID is required');
    }
    if (!this.customerId || this.customerId.trim() === '') {
      throw new Error('Customer ID is required');
    }
    if (!this.products || this.products.length === 0) {
      throw new Error('At least one product is required');
    }
    this.products.forEach(product => {
      if (!product.productId || product.productId.trim() === '') {
        throw new Error('Product ID is required');
      }
      if (product.quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }
      if (product.price <= 0) {
        throw new Error('Price must be greater than 0');
      }
    });
    if (!['pending', 'completed', 'cancelled'].includes(this.status)) {
      throw new Error('Invalid order status');
    }
  }
}

// === ARCHIVO: api/src/domain/repositories/order.repository.ts ===
import { OrderEntity } from '../entities/order.entity';

/**
 * Interfaz del repositorio de órdenes que define los métodos CRUD.
 * La implementación concreta reside en la capa de infraestructura.
 */
export interface OrderRepository {
  /**
   * Crea una nueva orden en el almacén de datos.
   * @param order La orden a crear.
   * @returns La orden creada con su ID generado.
   */
  create(order: OrderEntity): Promise<OrderEntity>;

  /**
   * Busca una orden por su ID.
   * @param id El ID de la orden.
   * @returns La orden si existe, o null si no se encuentra.
   */
  findById(id: string): Promise<OrderEntity | null>;

  /**
   * Actualiza una orden existente.
   * @param id El ID de la orden a actualizar.
   * @param order Los datos actualizados de la orden.
   * @returns La orden actualizada.
   */
  update(id: string, order: OrderEntity): Promise<OrderEntity>;

  /**
   * Elimina una orden por su ID.
   * @param id El ID de la orden a eliminar.
   */
  delete(id: string): Promise<void>;
}

// === ARCHIVO: api/src/application/dtos/create-order.dto.ts ===
import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para validar los datos de entrada al crear una orden.
 * Utiliza decoradores de class-validator para validación automática.
 */
class ProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: string;

  @IsNumber()
  @IsPositive({ message: 'Quantity must be greater than 0' })
  quantity: number;

  @IsNumber()
  @IsPositive({ message: 'Price must be greater than 0' })
  price: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Customer ID is required' })
  customerId: string;

  @IsArray({ message: 'Products must be an array' })
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  /**
   * Valida que el DTO cumpla con las reglas de negocio.
   * @throws Error si alguna validación falla.
   */
  validate(): void {
    if (!this.customerId || this.customerId.trim() === '') {
      throw new Error('Customer ID is required');
    }
    if (!this.products || this.products.length === 0) {
      throw new Error('At least one product is required');
    }
    this.products.forEach(product => {
      if (!product.productId || product.productId.trim() === '') {
        throw new Error('Product ID is required');
      }
      if (product.quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }
      if (product.price <= 0) {
        throw new Error('Price must be greater than 0');
      }
    });
  }
}

// === ARCHIVO: api/src/application/dtos/update-order.dto.ts ===
import { IsString, IsOptional, IsNumber, IsEnum, Min, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiPropertyOptional({ description: 'ID del cliente que realiza la orden', example: 'cust_12345' })
  @IsOptional()
  @IsString()
  readonly customerId?: string;

  @ApiPropertyOptional({ description: 'Fecha de la orden', example: '2024-01-15T10:30:00Z' })
  @IsOptional()
  @IsDateString()
  readonly orderDate?: string;

  @ApiPropertyOptional({ description: 'Monto total de la orden', example: 150.00 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly total?: number;

  @ApiPropertyOptional({ description: 'Estado de la orden', enum: ['pending', 'completed', 'cancelled'], example: 'pending' })
  @IsOptional()
  @IsEnum(['pending', 'completed', 'cancelled'])
  readonly status?: 'pending' | 'completed' | 'cancelled';

  @ApiPropertyOptional({ description: 'Notas adicionales de la orden', example: 'Entregar en puerta principal' })
  @IsOptional()
  @IsString()
  readonly notes?: string;

  constructor(partial: Partial<UpdateOrderDto>) {
    Object.assign(this, partial);
  }

  validate(): void {
    if (!this.customerId && !this.orderDate && !this.total && !this.status && !this.notes) {
      throw new Error('Debe proporcionar al menos un campo para actualizar');
    }
    
    if (this.total !== undefined && this.total < 0) {
      throw new Error('El total no puede ser negativo');
    }
  }
}

// === ARCHIVO: api/src/application/services/order.service.ts ===
import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { OrderEntity } from '../../domain/entities/order.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(forwardRef(() => OrderRepository))
    private readonly orderRepository: OrderRepository,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<OrderEntity> {
    dto.validate();
    
    const orderId = this.generateId();
    const now = new Date();
    const orderDate = dto.orderDate ? new Date(dto.orderDate) : now;

    const order = new OrderEntity(
      orderId,
      dto.customerId,
      orderDate,
      now,
    );

    order.validate();
    return this.orderRepository.create(order);
  }

  async getOrder(id: string): Promise<OrderEntity> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('El ID de la orden es requerido');
    }

    const order = await this.orderRepository.findById(id);
    
    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return order;
  }

  async updateOrder(id: string, dto: UpdateOrderDto): Promise<OrderEntity> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('El ID de la orden es requerido');
    }

    dto.validate();

    const existingOrder = await this.orderRepository.findById(id);
    
    if (!existingOrder) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    const updatedOrder = new OrderEntity(
      id,
      dto.customerId || existingOrder.customerId,
      dto.orderDate ? new Date(dto.orderDate) : existingOrder.orderDate,
      existingOrder.createdAt,
    );

    if (dto.status) {
      updatedOrder.updateStatus(dto.status);
    }

    updatedOrder.validate();
    return this.orderRepository.update(id, updatedOrder);
  }

  async deleteOrder(id: string): Promise<void> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('El ID de la orden es requerido');
    }

    const existingOrder = await this.orderRepository.findById(id);
    
    if (!existingOrder) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    if (existingOrder.status === 'completed') {
      throw new BadRequestException('No se puede eliminar una orden completada');
    }

    return this.orderRepository.delete(id);
  }

  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `ord_${timestamp}_${randomPart}`;
  }
}

// === ARCHIVO: api/src/infrastructure/config/dynamodb.config.ts ===
import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamodbConfig {
  private readonly documentClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(private readonly configService: NestConfigService) {
    const clientConfig = this.buildClientConfig();
    const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
    const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
    
    const client = new DynamoDBClient(clientConfig);
    this.documentClient = DynamoDBDocumentClient.from(client, {
      marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
    });
    
    this.tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME', 'orders');
  }

  private buildClientConfig(): DynamoDBClientConfig {
    const region = this.configService.get<string>('AWS_REGION', 'us-east-1');
    const endpoint = this.configService.get<string>('DYNAMODB_ENDPOINT');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    const config: DynamoDBClientConfig = {
      region,
    };

    if (endpoint) {
      config.endpoint = endpoint;
    }

    if (accessKeyId && secretAccessKey) {
      config.credentials = {
        accessKeyId,
        secretAccessKey,
      };
    }

    return config;
  }

  getDocumentClient(): DynamoDBDocumentClient {
    return this.documentClient;
  }

  getTableName(): string {
    return this.tableName;
  }
}

// === ARCHIVO: api/src/infrastructure/repositories/dynamodb/order.dynamodb.repository.ts ===
import { Injectable, Logger } from '@nestjs/common';
import { OrderRepository } from '../../../domain/repositories/order.repository';
import { OrderEntity } from '../../../domain/entities/order.entity';
import { DynamodbConfig } from '../../config/dynamodb.config';
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

export interface OrderDynamoItem {
  id: string;
  customerId: string;
  orderDate: string;
  createdAt: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  items?: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

@Injectable()
export class OrderDynamodbRepository implements OrderRepository {
  private readonly logger = new Logger(OrderDynamodbRepository.name);

  constructor(private readonly dynamodbConfig: DynamodbConfig) {}

  async create(order: OrderEntity): Promise<OrderEntity> {
    const tableName = this.dynamodbConfig.getTableName();
    const documentClient = this.dynamodbConfig.getDocumentClient();

    const item: OrderDynamoItem = {
      id: order.id,
      customerId: order.customerId,
      orderDate: order.orderDate.toISOString(),
      createdAt: order.createdAt.toISOString(),
      total: order.total,
      status: 'pending',
      items: order.items,
    };

    const command = new PutCommand({
      TableName: tableName,
      Item: item,
      ConditionExpression: 'attribute_not_exists(id)',
    });

    try {
      await documentClient.send(command);
      this.logger.log(`Orden creada exitosamente: ${order.id}`);
      return order;
    } catch (error) {
      this.logger.error(`Error al crear orden: ${error.message}`);
      throw error;
    }
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const tableName = this.dynamodbConfig.getTableName();
    const documentClient = this.dynamodbConfig.getDocumentClient();

    const command = new GetCommand({
      TableName: tableName,
      Key: { id },
    });

    try {
      const result = await documentClient.send(command);
      
      if (!result.Item) {
        this.logger.warn(`Orden no encontrada: ${id}`);
        return null;
      }

      const item = result.Item as OrderDynamoItem;
      return this.mapToEntity(item);
    } catch (error) {
      this.logger.error(`Error al buscar orden: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, order: OrderEntity): Promise<OrderEntity> {
    const tableName = this.dynamodbConfig.getTableName();
    const documentClient = this.dynamodbConfig.getDocumentClient();

    const updateExpression = 'SET customerId = :customerId, orderDate = :orderDate, total = :total, #status = :status, items = :items';
    const expressionAttributeNames: Record<string, string> = {
      '#status': 'status',
    };
    const expressionAttributeValues: Record<string, unknown> = {
      ':customerId': order.customerId,
      ':orderDate': order.orderDate.toISOString(),
      ':total': order.total,
      ':status': 'pending',
      ':items': order.items,
    };

    const command = new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    try {
      const result = await documentClient.send(command);
      this.logger.log(`Orden actualizada exitosamente: ${id}`);
      
      const item = result.Attributes as OrderDynamoItem;
      return this.mapToEntity(item);
    } catch (error) {
      this.logger.error(`Error al actualizar orden: ${error.message}`);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const tableName = this.dynamodbConfig.getTableName();
    const documentClient = this.dynamodbConfig.getDocumentClient();

    const command = new DeleteCommand({
      TableName: tableName,
      Key: { id },
      ConditionExpression: 'attribute_exists(id)',
    });

    try {
      await documentClient.send(command);
      this.logger.log(`Orden eliminada exitosamente: ${id}`);
    } catch (error) {
      this.logger.error(`Error al eliminar orden: ${error.message}`);
      throw error;
    }
  }

  private mapToEntity(item: OrderDynamoItem): OrderEntity {
    const entity = new OrderEntity(
      item.id,
      item.customerId,
      new Date(item.orderDate),
      new Date(item.createdAt),
      item.total,
    );
    
    if (item.items) {
      entity.items = item.items;
    }
    
    if (item.status && item.status !== 'pending') {
      entity.updateStatus(item.status);
    }
    
    return entity;
  }
}

// === ARCHIVO: api/src/infrastructure/controllers/order.controller.ts ===
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { OrderService } from '../../application/services/order.service';
import { CreateOrderDto } from '../../application/dtos/create-order.dto';
import { UpdateOrderDto } from '../../application/dtos/update-order.dto';
import { OrderEntity } from '../../domain/entities/order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Orden creada exitosamente',
    type: OrderEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de orden inválidos',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor',
  })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    try {
      this.logger.log(`Creando orden para cliente: ${createOrderDto.customerId}`);
      createOrderDto.validate();
      const order = await this.orderService.createOrder(createOrderDto);
      this.logger.log(`Orden creada exitosamente con ID: ${order.id}`);
      return order;
    } catch (error) {
      this.logger.error(`Error al crear orden: ${error.message}`);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear la orden');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la orden',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orden encontrada',
    type: OrderEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  async getOrder(@Param('id') id: string): Promise<OrderEntity> {
    try {
      this.logger.log(`Buscando orden con ID: ${id}`);
      const order = await this.orderService.getOrder(id);
      
      if (!order) {
        this.logger.warn(`Orden no encontrada: ${id}`);
        throw new NotFoundException(`Orden con ID ${id} no encontrada`);
      }
      
      return order;
    } catch (error) {
      this.logger.error(`Error al obtener orden: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener la orden');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una orden existente' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la orden',
    type: String,
  })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orden actualizada exitosamente',
    type: OrderEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de orden inválidos',
  })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    try {
      this.logger.log(`Actualizando orden con ID: ${id}`);
      
      const existingOrder = await this.orderService.getOrder(id);
      if (!existingOrder) {
        throw new NotFoundException(`Orden con ID ${id} no encontrada`);
      }
      
      updateOrderDto.validate();
      const order = await this.orderService.updateOrder(id, updateOrderDto);
      this.logger.log(`Orden actualizada exitosamente: ${id}`);
      return order;
    } catch (error) {
      this.logger.error(`Error al actualizar orden: ${error.message}`);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar la orden');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una orden' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la orden',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Orden eliminada exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  async deleteOrder(@Param('id') id: string): Promise<void> {
    try {
      this.logger.log(`Eliminando orden con ID: ${id}`);
      
      const existingOrder = await this.orderService.getOrder(id);
      if (!existingOrder) {
        throw new NotFoundException(`Orden con ID ${id} no encontrada`);
      }
      
      await this.orderService.deleteOrder(id);
      this.logger.log(`Orden eliminada exitosamente: ${id}`);
    } catch (error) {
      this.logger.error(`Error al eliminar orden: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al eliminar la orden');
    }
  }
}

// === ARCHIVO: api/src/app.module.ts ===
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { OrderController } from './infrastructure/controllers/order.controller';
import { OrderService } from './application/services/order.service';
import { OrderRepository } from './domain/repositories/order.repository';
import { OrderDynamodbRepository } from './infrastructure/repositories/dynamodb/order.dynamodb.repository';
import { DynamodbConfig } from './infrastructure/config/dynamodb.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: (configService: ConfigService) => {
        const requiredVars = ['AWS_REGION', 'DYNAMODB_TABLE_ORDERS'];
        const missing = requiredVars.filter(v => !configService.get(v));
        if (missing.length > 0) {
          throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
        return true;
      },
    }),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: OrderRepository,
      useClass: OrderDynamodbRepository,
    },
    DynamodbConfig,
    {
      provide: APP_GUARD,
      useValue: [],
    },
    {
      provide: APP_INTERCEPTOR,
      useValue: [],
    },
  ],
  exports: [OrderService, OrderRepository],
})
export class AppModule {}

// === ARCHIVO: api/test/order.service.spec.ts ===
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../src/application/services/order.service';
import { OrderRepository } from '../src/domain/repositories/order.repository';
import { OrderEntity } from '../src/domain/entities/order.entity';
import { CreateOrderDto } from '../src/application/dtos/create-order.dto';
import { UpdateOrderDto } from '../src/application/dtos/update-order.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  let repository: jest.Mocked<OrderRepository>;

  const mockOrderEntity = new OrderEntity(
    'order-123',
    'customer-456',
    new Date('2024-01-15T10:00:00Z'),
    new Date('2024-01-15T10:00:00Z'),
    151.00,
  );
  mockOrderEntity.items = [
    { productId: 'prod-1', quantity: 2, price: 25.50 },
    { productId: 'prod-2', quantity: 1, price: 100.00 },
  ];

  const mockCreateOrderDto: CreateOrderDto = {
    customerId: 'customer-456',
    items: [
      { productId: 'prod-1', quantity: 2, price: 25.50 },
      { productId: 'prod-2', quantity: 1, price: 100.00 },
    ],
  };

  const mockUpdateOrderDto: UpdateOrderDto = {
    status: 'completed',
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get(OrderRepository);
  });

  describe('createOrder', () => {
    it('debería crear una orden exitosamente cuando los datos son válidos', async () => {
      repository.create.mockResolvedValue(mockOrderEntity);

      const result = await service.createOrder(mockCreateOrderDto);

      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId: mockCreateOrderDto.customerId,
          items: mockCreateOrderDto.items,
        }),
      );
      expect(result).toEqual(mockOrderEntity);
    });

    it('debería lanzar BadRequestException cuando el DTO es inválido', async () => {
      const invalidDto: CreateOrderDto = {
        customerId: '',
        items: [],
      };

      await expect(service.createOrder(invalidDto)).rejects.toThrow(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando el repositorio falla', async () => {
      repository.create.mockRejectedValue(new Error('DynamoDB connection failed'));

      await expect(service.createOrder(mockCreateOrderDto)).rejects.toThrow();
    });

    it('debería calcular el total correctamente al crear la orden', async () => {
      repository.create.mockImplementation(async (order: OrderEntity) => {
        return order;
      });

      const result = await service.createOrder(mockCreateOrderDto);

      expect(result.total).toBe(151.00);
    });
  });

  describe('getOrder', () => {
    it('debería obtener una orden por su ID exitosamente', async () => {
      repository.findById.mockResolvedValue(mockOrderEntity);

      const result = await service.getOrder('order-123');

      expect(repository.findById).toHaveBeenCalledWith('order-123');
      expect(result).toEqual(mockOrderEntity);
    });

    it('debería lanzar NotFoundException cuando la orden no existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getOrder('non-existent-id')).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar BadRequestException cuando el ID está vacío', async () => {
      await expect(service.getOrder('')).rejects.toThrow(BadRequestException);
      expect(repository.findById).not.toHaveBeenCalled();
    });
  });

  describe('updateOrder', () => {
    it('debería actualizar una orden exitosamente', async () => {
      const updatedOrder = new OrderEntity(
        'order-123',
        'customer-456',
        new Date('2024-01-15T10:00:00Z'),
        new Date('2024-01-15T10:00:00Z'),
        151.00,
      );
      updatedOrder.items = [
        { productId: 'prod-1', quantity: 2, price: 25.50 },
        { productId: 'prod-2', quantity: 1, price: 100.00 },
      ];
      updatedOrder.updateStatus('completed');

      repository.findById.mockResolvedValue(mockOrderEntity);
      repository.update.mockResolvedValue(updatedOrder);

      const result = await service.updateOrder('order-123', mockUpdateOrderDto);

      expect(repository.update).toHaveBeenCalledWith('order-123', expect.any(OrderEntity));
      expect(result.status).toBe('completed');
    });

    it('debería lanzar NotFoundException al actualizar una orden inexistente', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.updateOrder('non-existent-id', mockUpdateOrderDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('debería validar el estado antes de actualizar', async () => {
      const invalidUpdateDto: UpdateOrderDto = {
        status: 'invalid-status' as any,
      };

      await expect(
        service.updateOrder('order-123', invalidUpdateDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteOrder', () => {
    it('debería eliminar una orden exitosamente', async () => {
      repository.findById.mockResolvedValue(mockOrderEntity);
      repository.delete.mockResolvedValue();

      await service.deleteOrder('order-123');

      expect(repository.delete).toHaveBeenCalledWith('order-123');
    });

    it('debería lanzar NotFoundException al eliminar una orden inexistente', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.deleteOrder('non-existent-id')).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar BadRequestException cuando el ID está vacío', async () => {
      await expect(service.deleteOrder('')).rejects.toThrow(BadRequestException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});

// === ARCHIVO: api/test/order.controller.spec.ts ===
import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../src/infrastructure/controllers/order.controller';
import { OrderService } from '../src/application/services/order.service';
import { OrderEntity } from '../src/domain/entities/order.entity';
import { CreateOrderDto } from '../src/application/dtos/create-order.dto';
import { UpdateOrderDto } from '../src/application/dtos/update-order.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OrderController', () => {
  let controller: OrderController;
  let service: jest.Mocked<OrderService>;

  const mockOrderEntity = new OrderEntity(
    'order-123',
    'customer-456',
    new Date('2024-01-15T10:00:00Z'),
    new Date('2024-01-15T10:00:00Z'),
    151.00,
  );
  mockOrderEntity.items = [
    { productId: 'prod-1', quantity: 2, price: 25.50 },
    { productId: 'prod-2', quantity: 1, price: 100.00 },
  ];

  const mockCreateOrderDto: CreateOrderDto = {
    customerId: 'customer-456',
    items: [
      { productId: 'prod-1', quantity: 2, price: 25.50 },
      { productId: 'prod-2', quantity: 1, price: 100.00 },
    ],
  };

  const mockUpdateOrderDto: UpdateOrderDto = {
    status: 'completed',
  };

  beforeEach(async () => {
    const mockService = {
      createOrder: jest.fn(),
      getOrder: jest.fn(),
      updateOrder: jest.fn(),
      deleteOrder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get(OrderService);
  });

  describe('createOrder', () => {
    it('debería crear una nueva orden y retornar 201', async () => {
      service.createOrder.mockResolvedValue(mockOrderEntity);

      const result = await controller.createOrder(mockCreateOrderDto);

      expect(service.createOrder).toHaveBeenCalledWith(mockCreateOrderDto);
      expect(result).toEqual(mockOrderEntity);
    });

    it('debería lanzar excepción cuando el DTO es inválido', async () => {
      const invalidDto = { customerId: '', items: [] };
      service.createOrder.mockRejectedValue(new BadRequestException('Validation failed'));

      await expect(controller.createOrder(invalidDto as any)).rejects.toThrow(BadRequestException);
    });

    it('debería manejar errores del servicio correctamente', async () => {
      service.createOrder.mockRejectedValue(new Error('Internal error'));

      await expect(controller.createOrder(mockCreateOrderDto)).rejects.toThrow();
    });
  });

  describe('getOrder', () => {
    it('debería obtener una orden por ID y retornar 200', async () => {
      service.getOrder.mockResolvedValue(mockOrderEntity);

      const result = await controller.getOrder('order-123');

      expect(service.getOrder).toHaveBeenCalledWith('order-123');
      expect(result).toEqual(mockOrderEntity);
    });

    it('debería lanzar NotFoundException cuando la orden no existe', async () => {
      service.getOrder.mockRejectedValue(new NotFoundException('Order not found'));

      await expect(controller.getOrder('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('debería validar que el ID no esté vacío', async () => {
      service.getOrder.mockRejectedValue(new BadRequestException('ID is required'));

      await expect(controller.getOrder('')).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateOrder', () => {
    it('debería actualizar una orden y retornar 200', async () => {
      const updatedOrder = new OrderEntity(
        'order-123',
        'customer-456',
        new Date('2024-01-15T10:00:00Z'),
        new Date('2024-01-15T10:00:00Z'),
        151.00,
      );
      updatedOrder.items = [
        { productId: 'prod-1', quantity: 2, price: 25.50 },
        { productId: 'prod-2', quantity: 1, price: 100.00 },
      ];
      updatedOrder.updateStatus('completed');
      service.updateOrder.mockResolvedValue(updatedOrder);

      const result = await controller.updateOrder('order-123', mockUpdateOrderDto);

      expect(service.updateOrder).toHaveBeenCalledWith('order-123', mockUpdateOrderDto);
      expect(result.status).toBe('completed');
    });

    it('debería lanzar NotFoundException al actualizar orden inexistente', async () => {
      service.updateOrder.mockRejectedValue(new NotFoundException('Order not found'));

      await expect(
        controller.updateOrder('non-existent', mockUpdateOrderDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('debería validar el formato del ID', async () => {
      service.updateOrder.mockRejectedValue(new BadRequestException('Invalid ID format'));

      await expect(
        controller.updateOrder('invalid-id-format', mockUpdateOrderDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteOrder', () => {
    it('debería eliminar una orden exitosamente', async () => {
      service.deleteOrder.mockResolvedValue();

      await controller.deleteOrder('order-123');

      expect(service.deleteOrder).toHaveBeenCalledWith('order-123');
    });

    it('debería lanzar NotFoundException al eliminar orden inexistente', async () => {
      service.deleteOrder.mockRejectedValue(new NotFoundException('Order not found'));

      await expect(controller.deleteOrder('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('debería manejar errores de validación del ID', async () => {
      service.deleteOrder.mockRejectedValue(new BadRequestException('Invalid ID'));

      await expect(controller.deleteOrder('')).rejects.toThrow(BadRequestException);
    });
  });
});

// === ARCHIVO: api/test/jest-e2e.json ===
{
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}


// === ARCHIVO: client/package.json ===
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint . --ext ts,tsx",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "@tanstack/react-query": "^5.29.2",
    "axios": "^1.6.8",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.51.3",
    "react-router-dom": "^6.22.3",
    "zod": "^3.23.8",
    "zustand": "^4.5.2",
    "@tanstack/react-query-devtools": "^5.29.2",
    "react-toastify": "^10.0.5"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^16.3.3",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "jsdom": "^24.0.0",
    "prettier": "^3.2.5",
    "sass-embedded": "^1.77.0",
    "typescript": "^5.4.5",
    "vite": "^5.2.8",
    "vitest": "^1.5.0"
  }
}

// === ARCHIVO: client/vite.config.ts ===
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          tanstack: ['@tanstack/react-query'],
          forms: ['react-hook-form', '@hookform/resolvers'],
          state: ['zustand']
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts']
  }
});

// === ARCHIVO: client/tsconfig.json ===
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": [
      "ES2020",
      "DOM",
      "DOM.Iterable"
    ],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "node",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "src/*"
      ]
    }
  },
  "include": [
    "src"
  ]
}


// === ARCHIVO: client/src/main.tsx ===
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

if (import.meta.env.MODE === 'development') {
  import('./mocks/browser').then(({ worker }) => {
    worker.start({
      onUnhandledRequest: 'bypass'
    });
  });
}

// === ARCHIVO: client/src/App.tsx ===
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import LoadingSpinner from '@/shared/components/LoadingSpinner';

const OrderListPage = lazy(() => import('@/features/orders/pages/OrderListPage'));
const OrderDetailPage = lazy(() => import('@/features/orders/pages/OrderDetailPage'));
const CreateOrderPage = lazy(() => import('@/features/orders/pages/CreateOrderPage'));
const UpdateOrderPage = lazy(() => import('@/features/orders/pages/UpdateOrderPage'));

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}> 
        <Routes>
          <Route path="/" element={<OrderListPage />} />
          <Route path="/orders" element={<OrderListPage />} />
          <Route path="/orders/new" element={<CreateOrderPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/orders/:id/edit" element={<UpdateOrderPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

// === ARCHIVO: client/index.html ===
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Sistema de gestión de órdenes de compra" />
    <meta name="theme-color" content="#2563eb" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Gestión de Órdenes</title>
    <style>
      *,
      *::before,
      *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        font-size: 16px;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      body {
        min-height: 100vh;
        background-color: #f8fafc;
        color: #1e293b;
      }

      #root {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .app-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        gap: 1rem;
      }

      .app-loading__spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #e2e8f0;
        border-top-color: #2563eb;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      .app-loading__text {
        color: #64748b;
        font-size: 0.875rem;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .app-loading__spinner {
          animation: none;
          border-top-color: #2563eb;
        }
      }
    </style>
  </head>
  <body>
    <div id="root">
      <div class="app-loading">
        <div class="app-loading__spinner"></div>
        <span class="app-loading__text">Cargando aplicación...</span>
      </div>
    </div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

// === ARCHIVO: client/src/features/orders/pages/OrderListPage.tsx ===
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { OrderList } from '../components/OrderList';
import type { OrderEntity } from '../services/order.service';

export function OrderListPage() {
  const navigate = useNavigate();
  const { orders, isLoading, error, refetch } = useOrders();

  const handleViewDetails = (order: OrderEntity) => {
    navigate(`/orders/${order.id}`);
  };

  const handleEdit = (order: OrderEntity) => {
    navigate(`/orders/${order.id}/edit`);
  };

  const handleDelete = async (orderId: string) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta orden?');
    if (!confirmed) return;
    
    try {
      const { deleteOrder } = await import('../services/order.service');
      await deleteOrder(orderId);
      refetch();
    } catch (err) {
      console.error('Error al eliminar la orden:', err);
      alert('No se pudo eliminar la orden. Intenta de nuevo.');
    }
  };

  const handleCreateNew = () => {
    navigate('/orders/new');
  };

  if (isLoading) {
    return (
      <div className="order-list-page">
        <div className="order-list-page__loading">
          <div className="spinner" aria-label="Cargando órdenes"></div>
          <p>Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-list-page">
        <div className="order-list-page__error">
          <h2>Error al cargar las órdenes</h2>
          <p>{error.message}</p>
          <button onClick={() => refetch()} className="btn btn--primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-list-page">
      <header className="order-list-page__header">
        <h1 className="order-list-page__title">Gestión de Órdenes</h1>
        <button 
          onClick={handleCreateNew} 
          className="btn btn--primary order-list-page__create-btn"
          aria-label="Crear nueva orden"
        >
          + Nueva Orden
        </button>
      </header>

      <section className="order-list-page__content">
        <OrderList
          orders={orders || []}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>

      {orders && orders.length === 0 && (
        <div className="order-list-page__empty">
          <p>No hay órdenes registradas.</p>
          <button 
            onClick={handleCreateNew} 
            className="btn btn--secondary"
          >
            Crear primera orden
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderListPage;

// === ARCHIVO: client/src/features/orders/pages/OrderDetailPage.tsx ===
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOrder } from '../services/order.service';
import type { OrderEntity } from '../services/order.service';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('ID de orden no proporcionado');
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getOrder(id);
        setOrder(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido al cargar la orden';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleBack = () => {
    navigate('/orders');
  };

  const handleEdit = () => {
    if (order) {
      navigate(`/orders/${order.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!order) return;
    
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer.');
    if (!confirmed) return;

    try {
      const { deleteOrder } = await import('../services/order.service');
      await deleteOrder(order.id);
      navigate('/orders');
    } catch (err) {
      console.error('Error al eliminar la orden:', err);
      alert('No se pudo eliminar la orden. Intenta de nuevo.');
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="order-detail-page">
        <div className="order-detail-page__loading">
          <div className="spinner" aria-label="Cargando detalles de la orden"></div>
          <p>Cargando detalles de la orden...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-detail-page">
        <div className="order-detail-page__error">
          <h2>Error al cargar la orden</h2>
          <p>{error || 'Orden no encontrada'}</p>
          <button onClick={handleBack} className="btn btn--primary">
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <header className="order-detail-page__header">
        <button 
          onClick={handleBack} 
          className="btn btn--ghost order-detail-page__back-btn"
          aria-label="Volver a la lista de órdenes"
        >
          ← Volver
        </button>
        <div className="order-detail-page__actions">
          <button 
            onClick={handleEdit} 
            className="btn btn--secondary"
            aria-label="Editar orden"
          >
            Editar
          </button>
          <button 
            onClick={handleDelete} 
            className="btn btn--danger"
            aria-label="Eliminar orden"
          >
            Eliminar
          </button>
        </div>
      </header>

      <main className="order-detail-page__content">
        <section className="order-detail-page__info">
          <h1 className="order-detail-page__title">Orden #{order.id}</h1>
          
          <div className="order-detail-page__status">
            <span className={`badge badge--${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </div>

          <dl className="order-detail-page__details">
            <div className="order-detail-page__detail-item">
              <dt>Cliente:</dt>
              <dd>{order.customerName}</dd>
            </div>
            
            <div className="order-detail-page__detail-item">
              <dt>Email:</dt>
              <dd>{order.customerEmail}</dd>
            </div>
            
            <div className="order-detail-page__detail-item">
              <dt>Total:</dt>
              <dd className="order-detail-page__total">
                {formatCurrency(order.total)}
              </dd>
            </div>
            
            <div className="order-detail-page__detail-item">
              <dt>Fecha de creación:</dt>
              <dd>{formatDate(order.createdAt)}</dd>
            </div>
            
            {order.updatedAt && (
              <div className="order-detail-page__detail-item">
                <dt>Última actualización:</dt>
                <dd>{formatDate(order.updatedAt)}</dd>
              </div>
            )}
          </dl>
        </section>

        {order.items && order.items.length > 0 && (
          <section className="order-detail-page__items">
            <h2 className="order-detail-page__section-title">Artículos</h2>
            <table className="order-detail-page__items-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.unitPrice)}</td>
                    <td>{formatCurrency(item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
}

export default OrderDetailPage;

// === ARCHIVO: client/src/features/orders/pages/CreateOrderPage.tsx ===
import { useNavigate } from 'react-router-dom';
import { OrderForm } from '../components/OrderForm';
import { createOrder } from '../services/order.service';
import type { CreateOrderDto } from '../services/order.service';

export function CreateOrderPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateOrderDto) => {
    try {
      const newOrder = await createOrder(data);
      navigate(`/orders/${newOrder.id}`);
    } catch (err) {
      console.error('Error al crear la orden:', err);
      throw err;
    }
  };

  const handleCancel = () => {
    const confirmed = window.confirm('¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.');
    if (confirmed) {
      navigate('/orders');
    }
  };

  return (
    <div className="create-order-page">
      <header className="create-order-page__header">
        <button 
          onClick={handleCancel} 
          className="btn btn--ghost create-order-page__back-btn"
          aria-label="Volver a la lista de órdenes"
        >
          ← Volver
        </button>
        <h1 className="create-order-page__title">Crear Nueva Orden</h1>
      </header>

      <main className="create-order-page__content">
        <OrderForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={false}
        />
      </main>
    </div>
  );
}

export default CreateOrderPage;

// === ARCHIVO: client/src/features/orders/services/order.service.ts ===
import axios, { AxiosResponse } from 'axios';
import {
  OrderEntity,
  CreateOrderPayload,
  UpdateOrderPayload,
} from '../../../shared/hooks/useApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CreateOrderDto extends CreateOrderPayload {}

export interface UpdateOrderDto extends UpdateOrderPayload {}

export interface OrderResponse extends OrderEntity {}

export const orderService = {
  async createOrder(data: CreateOrderDto): Promise<OrderEntity> {
    const response: AxiosResponse<OrderEntity> = await apiClient.post<OrderEntity>(
      '/orders',
      data
    );
    return response.data;
  },

  async getOrder(id: string): Promise<OrderEntity> {
    const response: AxiosResponse<OrderEntity> = await apiClient.get<OrderEntity>(
      `/orders/${id}`
    );
    return response.data;
  },

  async updateOrder(id: string, data: UpdateOrderDto): Promise<OrderEntity> {
    const response: AxiosResponse<OrderEntity> = await apiClient.put<OrderEntity>(
      `/orders/${id}`,
      data
    );
    return response.data;
  },

  async deleteOrder(id: string): Promise<void> {
    await apiClient.delete(`/orders/${id}`);
  },

  async getAllOrders(): Promise<OrderEntity[]> {
    const response: AxiosResponse<OrderEntity[]> = await apiClient.get<OrderEntity[]>(
      '/orders'
    );
    return response.data;
  },
};

export const createOrder = orderService.createOrder;
export const getOrder = orderService.getOrder;
export const updateOrder = orderService.updateOrder;
export const deleteOrder = orderService.deleteOrder;
export const getAllOrders = orderService.getAllOrders;

export type { OrderEntity, CreateOrderPayload, UpdateOrderPayload };

// === ARCHIVO: client/src/features/orders/hooks/useOrders.ts ===
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/order.service';
import { CreateOrderDto, UpdateOrderDto } from '../types';
import { toast } from 'react-toastify';

export function useOrders() {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAllOrders(),
    staleTime: 5000,
  });

  const createOrderMutation = useMutation({
    mutationFn: (data: CreateOrderDto) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Orden creada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al crear orden: ${error.message}`);
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderDto }) =>
      orderService.updateOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Orden actualizada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar orden: ${error.message}`);
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Orden eliminada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar orden: ${error.message}`);
    },
  });

  return {
    orders: ordersQuery.data ?? [],
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
    createOrder: createOrderMutation.mutate,
    updateOrder: updateOrderMutation.mutate,
    deleteOrder: deleteOrderMutation.mutate,
    isCreating: createOrderMutation.isPending,
    isUpdating: updateOrderMutation.isPending,
    isDeleting: deleteOrderMutation.isPending,
  };
}

export function useOrder(id: string) {
  const queryClient = useQueryClient();

  const orderQuery = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
  });

  const updateOrderMutation = useMutation({
    mutationFn: (data: UpdateOrderDto) => orderService.updateOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Orden actualizada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar orden: ${error.message}`);
    },
  });

  return {
    order: orderQuery.data,
    isLoading: orderQuery.isLoading,
    error: orderQuery.error,
    updateOrder: updateOrderMutation.mutate,
    isUpdating: updateOrderMutation.isPending,
  };
}

// === ARCHIVO: client/src/features/orders/pages/UpdateOrderPage.tsx ===
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { orderService, OrderEntity, UpdateOrderDto } from '../services/order.service';
import { OrderForm } from '../components/OrderForm';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

const updateOrderSchema = z.object({
  customerName: z.string().min(1, 'El nombre del cliente es requerido'),
  customerEmail: z.string().email('Email inválido'),
  totalAmount: z.number().positive('El monto debe ser positivo'),
  status: z.enum(['pending', 'processing', 'completed', 'cancelled']),
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
  })).min(1, 'Debe tener al menos un producto'),
});

type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;

export function UpdateOrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateOrderFormData>({
    resolver: zodResolver(updateOrderSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      totalAmount: 0,
      status: 'pending',
      items: [],
    },
  });

  useEffect(() => {
    if (!id) {
      setError('ID de orden no proporcionado');
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrder(id);
        setOrder(data);
        reset({
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          totalAmount: data.totalAmount,
          status: data.status,
          items: data.items,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la orden');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, reset]);

  const onSubmit = async (data: UpdateOrderFormData) => {
    if (!id) return;

    try {
      const updateData: UpdateOrderDto = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        totalAmount: data.totalAmount,
        status: data.status,
        items: data.items,
      };

      await orderService.updateOrder(id, updateData);
      navigate(`/orders/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la orden');
    }
  };

  if (isLoading) {
    return (
      <div className="update-order-page">
        <div className="update-order-page__loading">
          <LoadingSpinner />
          <p>Cargando orden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div className="update-order-page">
          <div className="update-order-page__error">
            <p className="update-order-page__error-message">{error}</p>
            <button 
              className="update-order-page__retry-button"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (!order) {
    return (
      <ErrorBoundary>
        <div className="update-order-page">
          <div className="update-order-page__not-found">
            <p>Orden no encontrada</p>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <div className="update-order-page">
      <header className="update-order-page__header">
        <h1 className="update-order-page__title">Actualizar Orden</h1>
        <p className="update-order-page__subtitle">
          Modifica los detalles de la orden #{order.id}
        </p>
      </header>

      <section className="update-order-page__content">
        <OrderForm
          register={register}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={false}
          submitLabel="Actualizar Orden"
          onCancel={() => navigate(`/orders/${id}`)}
        />
      </section>
    </div>
  );
}

// === ARCHIVO: client/src/features/orders/components/OrderForm.tsx ===
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface OrderFormData {
  customerName: string;
  customerEmail: string;
  product: string;
  quantity: number;
  price: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void;
  register: UseFormRegister<OrderFormData>;
  errors: FieldErrors<OrderFormData>;
  isLoading?: boolean;
  initialData?: Partial<OrderFormData>;
  submitLabel?: string;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  onSubmit,
  register,
  errors,
  isLoading = false,
  initialData,
  submitLabel = 'Crear Orden'
}) => {
  const inputBaseClasses = 'w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2';
  const inputNormalClasses = 'border-gray-300 focus:border-blue-500 focus:ring-blue-200';
  const inputErrorClasses = 'border-red-500 focus:border-red-500 focus:ring-red-200';
  const labelClasses = 'block text-sm font-medium text-gray-700 mb-1';
  const errorTextClasses = 'text-xs text-red-600 mt-1';
  const buttonBaseClasses = 'px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const getInputClasses = (hasError: boolean) =>
    `${inputBaseClasses} ${hasError ? inputErrorClasses : inputNormalClasses}`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: OrderFormData = {
          customerName: formData.get('customerName') as string,
          customerEmail: formData.get('customerEmail') as string,
          product: formData.get('product') as string,
          quantity: Number(formData.get('quantity')),
          price: Number(formData.get('price')),
          status: (formData.get('status') as OrderFormData['status']) || 'pending'
        };
        onSubmit(data);
      }}
      className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="customerName" className={labelClasses}>
            Nombre del Cliente
          </label>
          <input
            id="customerName"
            type="text"
            {...register('customerName', {
              required: 'El nombre es requerido',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' }
            })}
            defaultValue={initialData?.customerName}
            className={getInputClasses(!!errors.customerName)}
            placeholder="Juan Pérez"
          />
          {errors.customerName && (
            <p className={errorTextClasses}>{errors.customerName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="customerEmail" className={labelClasses}>
            Correo Electrónico
          </label>
          <input
            id="customerEmail"
            type="email"
            {...register('customerEmail', {
              required: 'El correo es requerido',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Correo inválido'
              }
            })}
            defaultValue={initialData?.customerEmail}
            className={getInputClasses(!!errors.customerEmail)}
            placeholder="juan@ejemplo.com"
          />
          {errors.customerEmail && (
            <p className={errorTextClasses}>{errors.customerEmail.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="product" className={labelClasses}>
            Producto
          </label>
          <input
            id="product"
            type="text"
            {...register('product', {
              required: 'El producto es requerido',
              minLength: { value: 3, message: 'Mínimo 3 caracteres' }
            })}
            defaultValue={initialData?.product}
            className={getInputClasses(!!errors.product)}
            placeholder="Laptop Pro X"
          />
          {errors.product && (
            <p className={errorTextClasses}>{errors.product.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="quantity" className={labelClasses}>
            Cantidad
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            {...register('quantity', {
              required: 'La cantidad es requerida',
              min: { value: 1, message: 'Mínimo 1 unidad' },
              valueAsNumber: true
            })}
            defaultValue={initialData?.quantity || 1}
            className={getInputClasses(!!errors.quantity)}
          />
          {errors.quantity && (
            <p className={errorTextClasses}>{errors.quantity.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className={labelClasses}>
            Precio Unitario ($)
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            {...register('price', {
              required: 'El precio es requerido',
              min: { value: 0.01, message: 'El precio debe ser mayor a 0' },
              valueAsNumber: true
            })}
            defaultValue={initialData?.price || 0}
            className={getInputClasses(!!errors.price)}
            placeholder="99.99"
          />
          {errors.price && (
            <p className={errorTextClasses}>{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className={labelClasses}>
            Estado
          </label>
          <select
            id="status"
            {...register('status', { required: 'El estado es requerido' })}
            defaultValue={initialData?.status || 'pending'}
            className={getInputClasses(!!errors.status)}
          >
            <option value="pending">Pendiente</option>
            <option value="processing">Procesando</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
          {errors.status && (
            <p className={errorTextClasses}>{errors.status.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isLoading}
          className={`${buttonBaseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-300`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Procesando...
            </span>
          ) : submitLabel}
        </button>
      </div>
    </form>
  );
};

// === ARCHIVO: client/src/features/orders/components/OrderList.tsx ===
import React from 'react';

interface OrderItem {
  id: string;
  customerName: string;
  customerEmail: string;
  product: string;
  quantity: number;
  price: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

interface OrderListProps {
  orders: OrderItem[];
  onEdit?: (order: OrderItem) => void;
  onDelete?: (orderId: string) => void;
  onView?: (orderId: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200'
};

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  completed: 'Completado',
  cancelled: 'Cancelado'
};

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
  emptyMessage = 'No hay órdenes para mostrar'
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteClick = (orderId: string, customerName: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la orden de ${customerName}?`)) {
      onDelete?.(orderId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-500 text-center">{emptyMessage}</p>
        <p className="text-gray-400 text-sm text-center mt-1">Crea tu primera orden para comenzar</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{order.customerName}</span>
                    <span className="text-xs text-gray-500">{order.customerEmail}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{order.product}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{order.quantity}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.price * order.quantity)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-xs text-gray-500">
                    {formatDate(order.createdAt)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(order.id)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                        title="Ver detalles"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(order)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                        title="Editar orden"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => handleDeleteClick(order.id, order.customerName)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                        title="Eliminar orden"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// === ARCHIVO: client/src/shared/components/ErrorBoundary.tsx ===
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <h2 className="error-boundary__title">
              Algo salió mal
            </h2>
            <p className="error-boundary__message">
              {this.state.error?.message || 'Ha ocurrido un error inesperado'}
            </p>
            <button
              className="error-boundary__retry-btn"
              onClick={this.handleRetry}
              type="button"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps): ReactNode {
  return (
    <div className="error-fallback">
      <h3 className="error-fallback__title">Error</h3>
      <p className="error-fallback__message">{error.message}</p>
      <button
        className="error-fallback__button"
        onClick={resetErrorBoundary}
        type="button"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

export class AsyncErrorBoundary extends Component<AsyncErrorBoundaryProps, State> {
  constructor(props: AsyncErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error);
    console.error('Error asíncrono capturado:', error, errorInfo);
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <ErrorFallback
          error={this.state.error!}
          resetErrorBoundary={this.reset}
        />
      );
    }
    return this.props.children;
  }
}

// === ARCHIVO: client/src/shared/hooks/useApi.ts ===
import { useState, useCallback, useEffect } from 'react';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export interface UseApiReturn<T, D = unknown> extends UseApiState<T> {
  execute: (config?: AxiosRequestConfig<D>) => Promise<T | null>;
  reset: () => void;
}

export interface UseApiConfig<D = unknown> extends AxiosRequestConfig<D> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
}

export interface UpdateOrderPayload {
  status?: string;
  customerName?: string;
  customerEmail?: string;
  items?: OrderItem[];
  total?: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderEntity {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function parseError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return {
      message: axiosError.response?.data?.message || axiosError.message,
      status: axiosError.response?.status,
      code: axiosError.code,
    };
  }
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }
  return {
    message: 'Error desconocido',
  };
}

export function useApi<T = unknown, D = unknown>(
  url: string,
  config?: UseApiConfig<D>
): UseApiReturn<T, D> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(config?.immediate ?? false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async (overrideConfig?: AxiosRequestConfig<D>): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const mergedConfig: AxiosRequestConfig<D> = {
          ...config,
          ...overrideConfig,
          baseURL: API_BASE_URL,
          url,
          headers: {
            'Content-Type': 'application/json',
            ...config?.headers,
            ...overrideConfig?.headers,
          },
        };

        const response: AxiosResponse<T> = await axios.request<T>(mergedConfig);
        setData(response.data);
        config?.onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const parsedError = parseError(err);
        setError(parsedError);
        config?.onError?.(parsedError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, config]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (config?.immediate) {
      execute();
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

export function useCreateOrder<T = unknown>() {
  return useApi<T, CreateOrderPayload>('/orders', { method: 'POST' });
}

export function useGetOrder<T = unknown>(orderId: string) {
  return useApi<T>(`/orders/${orderId}`, { method: 'GET' });
}

export function useUpdateOrder<T = unknown>(orderId: string) {
  return useApi<T, UpdateOrderPayload>(`/orders/${orderId}`, { method: 'PUT' });
}

export function useDeleteOrder<T = unknown>(orderId: string) {
  return useApi<T>(`/orders/${orderId}`, { method: 'DELETE' });
}

interface UseListApiState<T> extends UseApiState<T[]> {
  execute: (config?: AxiosRequestConfig) => Promise<T[] | null>;
}

export function useListOrders<T = OrderEntity>(): UseListApiState<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async (): Promise<T[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<T[]> = await axios.get<T[]>(
        `${API_BASE_URL}/orders`
      );
      setData(response.data);
      return response.data;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset: () => {
      setData(null);
      setError(null);
      setLoading(false);
    },
  };
}

interface UseMutationOptions<T, D> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

export function useMutation<T, D = unknown>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  options?: UseMutationOptions<T, D>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(
    async (payload?: D): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const response: AxiosResponse<T> = await axios.request<T>({
          baseURL: API_BASE_URL,
          url,
          method,
          data: payload,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setData(response.data);
        options?.onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const parsedError = parseError(err);
        setError(parsedError);
        options?.onError?.(parsedError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, method, options]
  );

  return {
    data,
    loading,
    error,
    mutate,
    reset: () => {
      setData(null);
      setError(null);
      setLoading(false);
    },
  };
}

// === ARCHIVO: client/src/index.scss ===
:root {
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-secondary: #64748b;
  --color-success: #22c55e;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-background: #f8fafc;
  --color-surface: #ffffff;
  --color-text-primary: #1e293b;
  --color-text-secondary: #64748b;
  --color-border: #e2e8f0;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 250ms ease-in-out;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  line-height: 1.5;
  min-height: 100vh;
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--color-primary-hover);
  }
}

button {
  cursor: pointer;
  font-family: inherit;
  border: none;
  outline: none;
  transition: all var(--transition-fast);
}

input,
textarea,
select {
  font-family: inherit;
  font-size: 1rem;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page {
  flex: 1;
  padding: 2rem 0;
}

.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);

  &--primary {
    background-color: var(--color-primary);
    color: white;

    &:hover {
      background-color: var(--color-primary-hover);
    }
  }

  &--secondary {
    background-color: var(--color-secondary);
    color: white;

    &:hover {
      opacity: 0.9;
    }
  }

  &--danger {
    background-color: var(--color-error);
    color: white;

    &:hover {
      opacity: 0.9;
    }
  }

  &--outline {
    background-color: transparent;
    border: 1px solid var(--color-border);
    color: var(--color-text-primary);

    &:hover {
      background-color: var(--color-background);
    }
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 0.375rem;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &--error {
    border-color: var(--color-error);

    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }
}

.error-text {
  font-size: 0.75rem;
  color: var(--color-error);
  margin-top: 0.25rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);

  th,
  td {
    padding: 0.875rem 1rem;
    text-align: left;
    border-bottom: 1px solid var(--color-border);
  }

  th {
    background-color: var(--color-background);
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background-color: var(--color-background);
  }
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--color-text-secondary);
}

.error {
  padding: 1rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  color: var(--color-error);
  margin-bottom: 1rem;
}

.text-center {
  text-align: center;
}

.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mt-8 { margin-top: 2rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-8 { margin-bottom: 2rem; }

.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-end { justify-content: flex-end; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }

// === ARCHIVO: client/src/setupTests.ts ===
// Setup de tests generado automaticamente (referenciado por la config del runner).
// Agrega aca matchers globales o mocks compartidos.
export {};


// === ARCHIVO: client/src/mocks/browser.ts ===
import { setupWorker } from 'msw/browser';
import { http, HttpResponse, delay } from 'msw';

interface MockOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

const mockOrders: MockOrder[] = [
  {
    id: 'ord-001',
    customerName: 'Juan Pérez',
    customerEmail: 'juan.perez@example.com',
    items: [
      { productId: 'prod-001', productName: 'Laptop Pro', quantity: 1, unitPrice: 1299.99 },
      { productId: 'prod-002', productName: 'Mouse Inalámbrico', quantity: 2, unitPrice: 29.99 }
    ],
    totalAmount: 1359.97,
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:45:00Z'
  },
  {
    id: 'ord-002',
    customerName: 'María García',
    customerEmail: 'maria.garcia@example.com',
    items: [
      { productId: 'prod-003', productName: 'Monitor 27"', quantity: 1, unitPrice: 399.99 }
    ],
    totalAmount: 399.99,
    status: 'processing',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T11:20:00Z'
  },
  {
    id: 'ord-003',
    customerName: 'Carlos López',
    customerEmail: 'carlos.lopez@example.com',
    items: [
      { productId: 'prod-004', productName: 'Teclado Mecánico', quantity: 1, unitPrice: 149.99 },
      { productId: 'prod-005', productName: 'Alfombrilla XL', quantity: 1, unitPrice: 24.99 },
      { productId: 'prod-006', productName: 'Auriculares USB', quantity: 1, unitPrice: 79.99 }
    ],
    totalAmount: 254.97,
    status: 'pending',
    createdAt: '2024-01-17T16:00:00Z',
    updatedAt: '2024-01-17T16:00:00Z'
  }
];

const generateId = () => `ord-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const handlers = [
  http.get('http://localhost:3000/orders', async () => {
    await delay(300);
    return HttpResponse.json(mockOrders);
  }),

  http.get('http://localhost:3000/orders/:id', async ({ params }) => {
    await delay(200);
    const order = mockOrders.find(o => o.id === params.id);
    if (!order) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(order);
  }),

  http.post('http://localhost:3000/orders', async ({ request }) => {
    await delay(400);
    const body = await request.json() as Omit<MockOrder, 'id' | 'createdAt' | 'updatedAt'>;
    const newOrder: MockOrder = {
      ...body,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockOrders.push(newOrder);
    return HttpResponse.json(newOrder, { status: 201 });
  }),

  http.put('http://localhost:3000/orders/:id', async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as Partial<MockOrder>;
    const index = mockOrders.findIndex(o => o.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockOrders[index] = {
      ...mockOrders[index],
      ...body,
      updatedAt: new Date().toISOString()
    };
    return HttpResponse.json(mockOrders[index]);
  }),

  http.delete('http://localhost:3000/orders/:id', async ({ params }) => {
    await delay(200);
    const index = mockOrders.findIndex(o => o.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockOrders.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  })
];

export const worker = setupWorker(...handlers);

// === ARCHIVO: client/src/shared/components/LoadingSpinner.tsx ===
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

const sizeStyles = {
  small: {
    width: '24px',
    height: '24px',
    borderWidth: '3px',
  },
  medium: {
    width: '48px',
    height: '48px',
    borderWidth: '4px',
  },
  large: {
    width: '64px',
    height: '64px',
    borderWidth: '5px',
  },
};

const spinnerContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
};

const spinnerStyles: React.CSSProperties = {
  borderRadius: '50%',
  borderStyle: 'solid',
  borderColor: '#3b82f6',
  borderTopColor: 'transparent',
  animation: 'spin 1s linear infinite',
};

const messageStyles: React.CSSProperties = {
  fontSize: '14px',
  color: '#6b7280',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  textAlign: 'center',
};

const fullScreenStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  zIndex: 9999,
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message,
  fullScreen = false,
}) => {
  const sizeConfig = sizeStyles[size];
  
  const containerStyle: React.CSSProperties = fullScreen
    ? { ...spinnerContainerStyles, ...fullScreenStyles }
    : spinnerContainerStyles;
  
  const spinnerStyle: React.CSSProperties = {
    ...spinnerStyles,
    width: sizeConfig.width,
    height: sizeConfig.height,
    borderWidth: sizeConfig.borderWidth,
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle} role="status" aria-label="Cargando" />
      {message && <span style={messageStyles}>{message}</span>}
    </div>
  );
};

export default LoadingSpinner;

// === ARCHIVO: infra/providers.tf ===
terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Configuración adicional para DynamoDB
provider "aws" {
  alias  = "dynamodb"
  region = var.aws_region
}

# Configuración para IAM
provider "aws" {
  alias  = "iam"
  region = "us-east-1" # IAM es global pero requiere región
}

# Validación de variables de entrada
locals {
  required_tags = {
    Project     = var.project_name != "" ? var.project_name : "order-management"
    Environment = contains(["dev", "staging", "prod"], var.environment) ? var.environment : "dev"
  }

  dynamodb_config = {
    billing_mode   = var.dynamodb_billing_mode
    read_capacity  = var.dynamodb_read_capacity
    write_capacity = var.dynamodb_write_capacity
    hash_key       = var.dynamodb_hash_key
    range_key      = var.dynamodb_range_key != "" ? var.dynamodb_range_key : null
  }
}

# Output de configuración para uso en otros módulos
output "project_tags" {
  description = "Tags aplicados a todos los recursos"
  value       = local.required_tags
}

output "dynamodb_config" {
  description = "Configuración de DynamoDB"
  value       = local.dynamodb_config
  sensitive   = true
}

output "aws_region_configured" {
  description = "Región AWS configurada"
  value       = var.aws_region
}

// === ARCHIVO: infra/variables.tf ===
variable "aws_region" {
  description = "Región AWS donde se desplegarán los recursos"
  type        = string
  default     = "us-east-1"

  validation {
    condition     = contains(["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"], var.aws_region)
    error_message = "La región debe ser una de las siguientes: us-east-1, us-west-2, eu-west-1, ap-southeast-1."
  }
}

variable "project_name" {
  description = "Nombre del proyecto para etiquetado de recursos"
  type        = string
  default     = "order-management"

  validation {
    condition     = length(var.project_name) >= 1 && length(var.project_name) <= 64
    error_message = "El nombre del proyecto debe tener entre 1 y 64 caracteres."
  }
}

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "El entorno debe ser uno de: dev, staging, prod."
  }
}

variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para órdenes"
  type        = string
  default     = "orders"

  validation {
    condition     = length(var.dynamodb_table_name) <= 255 && can(regex("^[a-zA-Z0-9_.-]+$", var.dynamodb_table_name))
    error_message = "El nombre de la tabla debe tener máximo 255 caracteres y solo puede contener letras, números, guiones bajos, guiones y puntos."
  }
}

variable "dynamodb_billing_mode" {
  description = "Modo de facturación para DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"

  validation {
    condition     = contains(["PROVISIONED", "PAY_PER_REQUEST"], var.dynamodb_billing_mode)
    error_message = "El modo de facturación debe ser PROVISIONED o PAY_PER_REQUEST."
  }
}

variable "dynamodb_read_capacity" {
  description = "Capacidad de lectura para DynamoDB (solo aplica si billing_mode es PROVISIONED)"
  type        = number
  default     = 5

  validation {
    condition     = var.dynamodb_read_capacity >= 1 && var.dynamodb_read_capacity <= 10000
    error_message = "La capacidad de lectura debe estar entre 1 y 10000."
  }
}

variable "dynamodb_write_capacity" {
  description = "Capacidad de escritura para DynamoDB (solo aplica si billing_mode es PROVISIONED)"
  type        = number
  default     = 5

  validation {
    condition     = var.dynamodb_write_capacity >= 1 && var.dynamodb_write_capacity <= 10000
    error_message = "La capacidad de escritura debe estar entre 1 y 10000."
  }
}

variable "dynamodb_hash_key" {
  description = "Clave hash (partition key) para la tabla DynamoDB"
  type        = string
  default     = "orderId"

  validation {
    condition     = length(var.dynamodb_hash_key) >= 1 && length(var.dynamodb_hash_key) <= 255
    error_message = "La clave hash debe tener entre 1 y 255 caracteres."
  }
}

variable "dynamodb_range_key" {
  description = "Clave de rango (sort key) para la tabla DynamoDB (opcional)"
  type        = string
  default     = ""

  validation {
    condition     = var.dynamodb_range_key == "" || (length(var.dynamodb_range_key) >= 1 && length(var.dynamodb_range_key) <= 255)
    error_message = "La clave de rango debe tener entre 1 y 255 caracteres si se especifica."
  }
}

variable "iam_policy_name" {
  description = "Nombre de la política IAM para acceso a DynamoDB"
  type        = string
  default     = "OrderManagementDynamoDBAccess"

  validation {
    condition     = length(var.iam_policy_name) <= 128 && can(regex("^[a-zA-Z0-9_-]+$", var.iam_policy_name))
    error_message = "El nombre de la política debe tener máximo 128 caracteres y solo puede contener letras, números, guiones y guiones bajos."
  }
}

variable "iam_role_name" {
  description = "Nombre del rol IAM para la aplicación"
  type        = string
  default     = "OrderManagementAppRole"

  validation {
    condition     = length(var.iam_role_name) <= 64 && can(regex("^[a-zA-Z0-9_-]+$", var.iam_role_name))
    error_message = "El nombre del rol debe tener máximo 64 caracteres y solo puede contener letras, números, guiones y guiones bajos."
  }
}

variable "dynamodb_attributes" {
  description = "Lista de atributos para la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
  default = []

  validation {
    condition     = length(var.dynamodb_attributes) == 0 || alltrue([for attr in var.dynamodb_attributes : contains(["S", "N", "B"], attr.type)])
    error_message = "Los tipos de atributos deben ser S (String), N (Number) o B (Binary)."
  }
}

variable "dynamodb_gsi" {
  description = "Índices secundarios globales para la tabla DynamoDB"
  type = list(object({
    name               = string
    hash_key           = string
    range_key          = optional(string, "")
    projection_type    = string
    read_capacity      = number
    write_capacity     = number
    non_key_attributes = list(string)
  }))
  default = []

  validation {
    condition     = length(var.dynamodb_gsi) == 0 || alltrue([for gsi in var.dynamodb_gsi : contains(["KEYS_ONLY", "INCLUDE", "ALL"], gsi.projection_type)])
    error_message = "El tipo de proyección debe ser KEYS_ONLY, INCLUDE o ALL."
  }
}

variable "tags" {
  description = "Etiquetas adicionales para los recursos"
  type        = map(string)
  default     = {}
}

// === ARCHIVO: infra/modules/dynamodb/variables.tf ===
variable "table_name" {
  description = "Nombre de la tabla DynamoDB"
  type        = string

  validation {
    condition     = length(var.table_name) <= 255 && can(regex("^[a-zA-Z0-9_.-]+$", var.table_name))
    error_message = "El nombre de la tabla debe tener máximo 255 caracteres y solo puede contener letras, números, guiones bajos, guiones y puntos."
  }
}

variable "billing_mode" {
  description = "Modo de facturación para DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"

  validation {
    condition     = contains(["PROVISIONED", "PAY_PER_REQUEST"], var.billing_mode)
    error_message = "El modo de facturación debe ser PROVISIONED o PAY_PER_REQUEST."
  }
}

variable "read_capacity" {
  description = "Capacidad de lectura para DynamoDB (solo aplica si billing_mode es PROVISIONED)"
  type        = number
  default     = 5

  validation {
    condition     = var.read_capacity >= 1 && var.read_capacity <= 10000
    error_message = "La capacidad de lectura debe estar entre 1 y 10000."
  }
}

variable "write_capacity" {
  description = "Capacidad de escritura para DynamoDB (solo aplica si billing_mode es PROVISIONED)"
  type        = number
  default     = 5

  validation {
    condition     = var.write_capacity >= 1 && var.write_capacity <= 10000
    error_message = "La capacidad de escritura debe estar entre 1 y 10000."
  }
}

variable "hash_key" {
  description = "Clave hash (partition key) para la tabla DynamoDB"
  type        = string

  validation {
    condition     = length(var.hash_key) >= 1 && length(var.hash_key) <= 255
    error_message = "La clave hash debe tener entre 1 y 255 caracteres."
  }
}

variable "range_key" {
  description = "Clave de rango (sort key) para la tabla DynamoDB (opcional)"
  type        = string
  default     = ""

  validation {
    condition     = var.range_key == "" || (length(var.range_key) >= 1 && length(var.range_key) <= 255)
    error_message = "La clave de rango debe tener entre 1 y 255 caracteres si se especifica."
  }
}

variable "attributes" {
  description = "Lista de atributos para la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
  default = []

  validation {
    condition     = length(var.attributes) == 0 || alltrue([for attr in var.attributes : contains(["S", "N", "B"], attr.type)])
    error_message = "Los tipos de atributos deben ser S (String), N (Number) o B (Binary)."
  }
}

variable "global_secondary_indexes" {
  description = "Lista de índices secundarios globales para la tabla DynamoDB"
  type = list(object({
    name               = string
    hash_key           = string
    range_key          = optional(string, "")
    projection_type    = string
    read_capacity      = number
    write_capacity     = number
    non_key_attributes = list(string)
  }))
  default = []

  validation {
    condition     = length(var.global_secondary_indexes) == 0 || alltrue([for gsi in var.global_secondary_indexes : contains(["KEYS_ONLY", "INCLUDE", "ALL"], gsi.projection_type)])
    error_message = "El tipo de proyección debe ser KEYS_ONLY, INCLUDE o ALL."
  }
}

variable "tags" {
  description = "Etiquetas adicionales para la tabla DynamoDB"
  type        = map(string)
  default     = {}
}

variable "stream_enabled" {
  description = "Habilitar stream para la tabla DynamoDB"
  type        = bool
  default     = false
}

variable "stream_view_type" {
  description = "Tipo de vista para el stream de DynamoDB (solo aplica si stream_enabled es true)"
  type        = string
  default     = "NEW_AND_OLD_IMAGES"

  validation {
    condition     = !var.stream_enabled || contains(["KEYS_ONLY", "NEW_IMAGE", "OLD_IMAGE", "NEW_AND_OLD_IMAGES"], var.stream_view_type)
    error_message = "El tipo de vista del stream debe ser KEYS_ONLY, NEW_IMAGE, OLD_IMAGE o NEW_AND_OLD_IMAGES."
  }
}

// === ARCHIVO: infra/modules/iam/variables.tf ===
variable "policy_name" {
  description = "Nombre de la política IAM"
  type        = string

  validation {
    condition     = length(var.policy_name) <= 128 && can(regex("^[a-zA-Z0-9_-]+$", var.policy_name))
    error_message = "El nombre de la política debe tener máximo 128 caracteres y solo puede contener letras, números, guiones y guiones bajos."
  }
}

variable "role_name" {
  description = "Nombre del rol IAM"
  type        = string

  validation {
    condition     = length(var.role_name) <= 64 && can(regex("^[a-zA-Z0-9_-]+$", var.role_name))
    error_message = "El nombre del rol debe tener máximo 64 caracteres y solo puede contener letras, números, guiones y guiones bajos."
  }
}

variable "dynamodb_table_arn" {
  description = "ARN de la tabla DynamoDB para la que se otorgarán permisos"
  type        = string

  validation {
    condition     = can(regex("^arn:aws:dynamodb:[a-z0-9-]+:[0-9]+:table/[a-zA-Z0-9_.-]+$", var.dynamodb_table_arn))
    error_message = "El ARN de la tabla DynamoDB debe tener un formato válido."
  }
}

variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para construir el ARN"
  type        = string

  validation {
    condition     = length(var.dynamodb_table_name) >= 1 && length(var.dynamodb_table_name) <= 255
    error_message = "El nombre de la tabla debe tener entre 1 y 255 caracteres."
  }
}

variable "additional_permissions" {
  description = "Permisos adicionales para la política IAM"
  type = list(object({
    effect    = string
    actions   = list(string)
    resources = list(string)
  }))
  default = []

  validation {
    condition     = length(var.additional_permissions) == 0 || alltrue([for perm in var.additional_permissions : contains(["Allow", "Deny"], perm.effect)])
    error_message = "El efecto debe ser Allow o Deny."
  }
}

variable "trusted_entities" {
  description = "Entidades confiables para asumir el rol IAM"
  type        = list(string)
  default     = ["lambda.amazonaws.com"]

  validation {
    condition     = length(var.trusted_entities) > 0
    error_message = "Debe especificarse al menos una entidad confiable."
  }
}

variable "tags" {
  description = "Etiquetas adicionales para los recursos IAM"
  type        = map(string)
  default     = {}
}

variable "aws_region" {
  description = "Región AWS para construir el ARN de la tabla"
  type        = string
  default     = "us-east-1"

  validation {
    condition     = can(regex("^[a-z]+-[a-z]+-[0-9]+$", var.aws_region))
    error_message = "La región debe tener un formato válido de AWS (ej: us-east-1)."
  }
}

variable "aws_account_id" {
  description = "ID de la cuenta AWS para construir el ARN de la tabla"
  type        = string

  validation {
    condition     = can(regex("^[0-9]{12}$", var.aws_account_id))
    error_message = "El ID de cuenta debe tener exactamente 12 dígitos."
  }
}

// === ARCHIVO: infra/versions.tf ===
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Validaciones de entrada mediante locals para usar en variables
locals {
  valid_regions        = ["us-east-1", "us-east-2", "us-west-1", "us-west-2", "eu-west-1", "eu-central-1"]
  valid_environments   = ["dev", "staging", "prod"]
  is_valid_region      = contains(local.valid_regions, var.aws_region)
  is_valid_environment = contains(local.valid_environments, var.environment)
}

# Validaciones cruzadas para la configuración de DynamoDB
locals {
  is_provisioned_mode = var.dynamodb_billing_mode == "PROVISIONED"
  capacity_configured = var.dynamodb_read_capacity > 0 && var.dynamodb_write_capacity > 0
  valid_capacity_mode = !local.is_provisioned_mode || local.capacity_configured
  table_name_valid    = var.dynamodb_table_name != "" && length(var.dynamodb_table_name) <= 255
  project_name_valid  = length(var.project_name) >= 3 && length(var.project_name) <= 50
}

# Mensajes de error para validaciones
locals {
  region_error_message       = "La región debe ser una región AWS válida: ${join(", ", local.valid_regions)}"
  environment_error_message  = "El entorno debe ser uno de: ${join(", ", local.valid_environments)}"
  project_name_error_message = "El nombre del proyecto debe tener entre 3 y 50 caracteres"
  table_name_error_message   = "El nombre de la tabla DynamoDB no puede estar vacío y debe tener máximo 255 caracteres"
  capacity_error_message     = "Para modo PROVISIONED, se deben especificar read_capacity y write_capacity mayores a 0"
}

# Output interno para validaciones (usado por variables)
output "_validation_outputs" {
  description = "Internal validation results"
  value = {
    is_valid_region            = local.is_valid_region
    is_valid_environment       = local.is_valid_environment
    valid_capacity_mode        = local.valid_capacity_mode
    table_name_valid           = local.table_name_valid
    project_name_valid         = local.project_name_valid
    region_error_message       = local.region_error_message
    environment_error_message  = local.environment_error_message
    project_name_error_message = local.project_name_error_message
    table_name_error_message   = local.table_name_error_message
    capacity_error_message     = local.capacity_error_message
  }
  sensitive = true
}

// === ARCHIVO: infra/README.md ===
# Módulo de Infraestructura - DynamoDB y IAM

Este módulo de Terraform provisiona los recursos de infraestructura necesarios para la aplicación de gestión de órdenes, incluyendo una tabla de DynamoDB y las políticas IAM asociadas.

## Recursos Provisionados

### Amazon DynamoDB
- Tabla de DynamoDB para almacenamiento de órdenes con capacidad bajo demanda
- Clave primaria: `orderId` (String)
- Índice secundario global para consultas por `customerId`
- Habilitación de Streams para captura de cambios
- Punto de acceso DAX (DynamoDB Accelerator) opcional para caché en memoria

### AWS Identity and Access Management (IAM)
- Rol de Lambda con permisos de lectura/escritura en la tabla
- Política de acceso con principio de mínimo privilegio
- Usuario de aplicación con credenciales programáticas
- Grupo de IAM para gestión centralizada de permisos

## Uso Básico

```hcl
module "infra" {
  source = "./infra"

  aws_region         = "us-east-1"
  project_name       = "ordenes-app"
  environment        = "dev"
  dynamodb_table_name = "ordenes"

  # Configuración de capacidad de DynamoDB
  dynamodb_billing_mode = "PAY_PER_REQUEST"
  dynamodb_hash_key     = "orderId"

  # Configuración de redundancy
  enable_dax         = false
  enable_point_in_time_recovery = true

  repository_url = "https://github.com/empresa/ordenes-app"
}
```

##Variables Requeridas

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `aws_region` | string | Región AWS donde se crearán los recursos |
| `project_name` | string | Nombre del proyecto para tagging |
| `environment` | string | Entorno (dev, staging, prod) |
| `dynamodb_table_name` | string | Nombre de la tabla DynamoDB |

## Variables Opcionales

| Variable | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `dynamodb_billing_mode` | string | "PAY_PER_REQUEST" | Modo de facturación |
| `dynamodb_hash_key` | string | "orderId" | Clave primaria de la tabla |
| `enable_dax` | bool | false | Habilitar DAX para caché |
| `enable_point_in_time_recovery` | bool | true | Recuperación a punto en tiempo |
| `dynamodb_attributes` | list(object) | [] | Atributos adicionales para índices |
| `repository_url` | string | "" | URL del repositorio |

## Outputs

| Output | Tipo | Descripción |
|--------|------|-------------|
| `dynamodb_table_name` | string | Nombre de la tabla creada |
| `dynamodb_table_arn` | string | ARN de la tabla |
| `dynamodb_table_stream_arn` | string | ARN del stream de la tabla |
| `iam_role_arn` | string | ARN del rol de Lambda |
| `iam_user_access_key` | string | ID de la clave de acceso |
| `iam_user_name` | string | Nombre del usuario IAM |

## Validación Local

Para validar la configuración de Terraform antes de aplicar:

```bash
cd infra
terraform init
terraform validate
terraform plan -var-file=../environments/dev/terraform.tfvars
```

## Recursos de Seguridad

- Cifrado en reposo con AWS KMS managed keys
- Cifrado en tránsito habilitado
- Políticas IAM con mínimo privilegio específico por operación
- CloudTrail habilitado para auditoría de operaciones
- VPC endpoint opcional para acceso privado a DynamoDB

## Consideraciones de Costos

- DynamoDB en modo PAY_PER_REQUEST facturado por solicitud
- DAX facturado por nodo por hora (si está habilitado)
- S3 para DynamoDB Streams (si está habilitado)
- IAM es servicio gratuito dentro de la cuenta

## Dependencias Externas

- Terraform >= 1.0
- Proveedor AWS ~> 5.0
- Credenciales AWS configuradas localmente o en entorno CI/CD

// === ARCHIVO: infra/main.tf ===
# Configuración principal de infraestructura para la aplicación de órdenes
# Este archivo orquesta los módulos de DynamoDB e IAM necesarios para persistir y acceder a las órdenes

# Módulo de DynamoDB para almacenamiento de órdenes
# Proporciona la tabla con clave primaria orderId e índice secundario por customerId
module "dynamodb" {
  source = "./modules/dynamodb"

  table_name     = var.dynamodb_table_name
  billing_mode   = var.dynamodb_billing_mode
  hash_key       = var.dynamodb_hash_key
  range_key      = var.dynamodb_range_key
  environment    = var.environment
  project_name   = var.project_name
  repository_url = var.repository_url

  # Configuración de atributos para índices secundarios
  attributes = var.dynamodb_attributes

  # Configuración de TTL para limpieza automática de órdenes antiguas
  ttl_attribute_name = var.dynamodb_ttl_attribute
  enable_ttl         = var.dynamodb_enable_ttl

  # Configuración de redundancia y recuperación
  enable_dax                    = var.enable_dax
  enable_point_in_time_recovery = var.enable_point_in_time_recovery
  enable_streams                = var.dynamodb_enable_streams

  # Configuración de capacidad (solo para modo PROVISIONED)
  read_capacity  = var.dynamodb_read_capacity
  write_capacity = var.dynamodb_write_capacity

  # Configuración de cifrado
  server_side_encryption_enabled = var.dynamodb_encryption_enabled
  kms_key_arn                    = var.dynamodb_kms_key_arn

  # Configuración de timeouts
  timeouts = {
    create = var.dynamodb_create_timeout
    update = var.dynamodb_update_timeout
    delete = var.dynamodb_delete_timeout
  }
}

# Módulo de IAM para acceso a la tabla de DynamoDB
# Crea el rol, políticas y usuario necesarios para que la aplicación acceda a DynamoDB
module "iam" {
  source = "./modules/iam"

  project_name   = var.project_name
  environment    = var.environment
  repository_url = var.repository_url

  # Nombre de la tabla DynamoDB para los permisos
  dynamodb_table_name = module.dynamodb.table_name
  dynamodb_table_arn  = module.dynamodb.table_arn

  # Habilitar generación de credenciales para usuario de aplicación
  create_app_user = var.create_iam_user

  # Configuración de permisos específicos
  enable_dynamodb_get_item    = var.iam_allow_get_item
  enable_dynamodb_put_item    = var.iam_allow_put_item
  enable_dynamodb_update_item = var.iam_allow_update_item
  enable_dynamodb_delete_item = var.iam_allow_delete_item
  enable_dynamodb_query       = var.iam_allow_query
  enable_dynamodb_scan        = var.iam_allow_scan
  enable_dynamodb_batch       = var.iam_allow_batch_operations

  # Permisos adicionales
  enable_cloudwatch_logs = var.iam_allow_cloudwatch
  enable_xray            = var.iam_allow_xray

  # Nombre del rol de Lambda
  lambda_role_name = "${var.project_name}-lambda-role-${var.environment}"

  # Nombre del usuario de aplicación
  app_user_name = "${var.project_name}-app-${var.environment}"
}

# Recurso adicional: SNS topic para notificaciones de órdenes
# Descomenta si necesitas notificaciones cuando se crean/actualizan órdenes
# resource "aws_sns_topic" "order_notifications" {
#   name = "${var.project_name}-orders-${var.environment}"
#   tags = {
#     Project     = var.project_name
#     Environment = var.environment
#     ManagedBy   = "terraform"
#   }
# }

# Recurso adicional: EventBridge rule para procesar eventos de DynamoDB Streams
# Descomenta si necesitas procesar eventos de cambios en órdenes
# resource "aws_cloudwatch_event_rule" "dynamodb_stream_rule" {
#   name           = "${var.project_name}-dynamodb-events-${var.environment}"
#   description   = "Rule para capturar eventos de DynamoDB Streams"
#   event_pattern = jsonencode({
#     "source" : ["aws.dynamodb"],
#     "detail-type" : ["INSERT", "MODIFY", "REMOVE"]
#   })
#   tags = {
#     Project     = var.project_name
#     Environment = var.environment
#     ManagedBy   = "terraform"
#   }
# }

# Recurso adicional: S3 bucket para logs de auditoría
# Descomenta si necesitas almacenar logs de operaciones con órdenes
# resource "aws_s3_bucket" "audit_logs" {
#   bucket = "${var.project_name}-audit-logs-${var.environment}"
#   tags = {
#     Project     = var.project_name
#     Environment = var.environment
#     ManagedBy   = "terraform"
#   }
# }

# resource "aws_s3_bucket_server_side_encryption_configuration" "audit_logs" {
#   bucket = aws_s3_bucket.audit_logs.id
#   rule {
#     apply_server_side_encryption_by_default {
#       sse_algorithm = "AES256"
#     }
#   }
# }

# Data source para obtener información de la cuenta AWS
# Útil para referencias cruzadas en políticas
data "aws_caller_identity" "current" {}

# Data source para obtener la zona de disponibilidad actual
data "aws_availability_zones" "available" {
  state = "available"
}

# Locals para construir ARNs y referencias comunes
locals {
  account_id     = data.aws_caller_identity.current.account_id
  partition      = data.aws_caller_identity.current.partition
  region         = var.aws_region
  table_name     = var.dynamodb_table_name
  full_table_arn = "arn:${local.partition}:dynamodb:${local.region}:${local.account_id}:table/${local.table_name}"
}

# Alias para el output del módulo DynamoDB
# Proporciona una interfaz unificada para otros módulos que consumen esta infraestructura
output "table_info" {
  description = "Información de la tabla DynamoDB"
  value = {
    name       = module.dynamodb.table_name
    arn        = module.dynamodb.table_arn
    stream_arn = module.dynamodb.stream_arn
    endpoint   = module.dynamodb.endpoint
  }
}

# Alias para los outputs del módulo IAM
output "access_info" {
  description = "Información de acceso IAM"
  value = {
    role_arn      = module.iam.role_arn
    user_name     = var.create_iam_user ? module.iam.user_name : null
    access_key_id = var.create_iam_user ? module.iam.access_key_id : null
  }
}

// === ARCHIVO: infra/outputs.tf ===
output "dynamodb_table_name" {
  description = "Nombre de la tabla de ordenes en DynamoDB"
  value       = module.dynamodb.orders_table_name
}

output "dynamodb_table_arn" {
  description = "ARN de la tabla de ordenes en DynamoDB"
  value       = module.dynamodb.orders_table_arn
}

output "dynamodb_table_endpoint" {
  description = "Endpoint de la tabla de ordenes en DynamoDB"
  value       = "https://dynamodb.${var.aws_region}.amazonaws.com"
}

output "dynamodb_partition_key" {
  description = "Nombre de la clave de particion de la tabla"
  value       = module.dynamodb.orders_table_partition_key_name
}

output "dynamodb_sort_key" {
  description = "Nombre de la clave de ordenamiento de la tabla"
  value       = module.dynamodb.orders_table_sort_key_name
}

output "iam_role_arn" {
  description = "ARN del rol IAM para acceso a DynamoDB"
  value       = module.iam.dynamodb_access_role_arn
}

output "iam_role_name" {
  description = "Nombre del rol IAM para acceso a DynamoDB"
  value       = module.iam.dynamodb_access_role_name
}

output "project_environment" {
  description = "Ambiente de despliegue"
  value       = var.environment
}

output "aws_region" {
  description = "Region de AWS configurada"
  value       = var.aws_region
}

output "table_stream_arn" {
  description = "ARN del stream de DynamoDB para captura de cambios"
  value       = module.dynamodb.orders_table_stream_arn
}

output "bucket_name" {
  description = "Nombre del bucket de S3 para artifacts"
  value       = aws_s3_bucket.artifacts.id
}

output "bucket_arn" {
  description = "ARN del bucket de S3 para artifacts"
  value       = aws_s3_bucket.artifacts.arn
}

output "complete_dynamodb_endpoint" {
  description = "Endpoint completo para conexion desde la aplicacion"
  value       = "dynamodb.${var.aws_region}.amazonaws.com"
}

output "table_endpoint_url" {
  description = "URL del endpoint de la tabla para SDK"
  value       = "https://dynamodb.${var.aws_region}.amazonaws.com/${module.dynamodb.orders_table_name}"
}

// === ARCHIVO: infra/environments/dev/terraform.tfvars ===
aws_region = "us-east-1"

environment = "dev"

project_name = "orders-management"

dynamodb_table_config = {
  table_name         = "orders-dev"
  billing_mode       = "PAY_PER_REQUEST"
  read_capacity      = 5
  write_capacity     = 5
  partition_key      = "orderId"
  partition_key_type = "S"
  sort_key           = "createdAt"
  sort_key_type      = "S"
  enable_ttl         = true
  ttl_attribute      = "expiresAt"
  enable_stream      = true
  stream_view_type   = "NEW_AND_OLD_IMAGES"
}

s3_config = {
  bucket_name     = "orders-artifacts-dev"
  versioning      = true
  lifecycle_rule  = true
  expiration_days = 30
}

iam_config = {
  role_name              = "orders-dynamodb-access-dev"
  enable_dynamodb_access = true
  enable_s3_read_access  = true
  enable_s3_write_access = true
  enable_cloudwatch_logs = true
}

tags = {
  Environment = "dev"
  Project     = "orders-management"
  ManagedBy   = "terraform"
  CostCenter  = "engineering"
  Team        = "platform"
}

vpc_config = {
  enable_vpc      = false
  vpc_cidr        = "10.0.0.0/16"
  public_subnets  = []
  private_subnets = []
}

network_config = {
  enable_nat_gateway   = false
  enable_vpc_endpoints = false
}

monitoring_config = {
  enable_cloudwatch          = true
  log_retention_days         = 7
  enable_deletion_protection = false
}

backup_config = {
  enable_backup   = false
  backup_schedule = "cron(0 5 ? * * *)"
  retention_days  = 7
}

kms_config = {
  enable_encryption    = true
  key_description      = "Clave KMS para datos de órdenes en ambiente dev"
  deletion_window_days = 7
  enable_key_rotation  = false
}

dynamodb_backup_config = {
  enable_point_in_time_recovery = true
  enable_on_demand_backup       = false
}

cognito_config = {
  enable_user_pool = false
  user_pool_name   = "orders-users-dev"
  enable_mfa       = false
}

api_gateway_config = {
  enable_api_gateway = false
  stage_name         = "dev"
  enable_caching     = false
}

// === ARCHIVO: infra/modules/dynamodb/main.tf ===
resource "aws_dynamodb_table" "orders" {
  name         = var.table_name
  billing_mode = var.billing_mode
  hash_key     = var.hash_key_attribute_name
  range_key    = var.range_key_attribute_name

  dynamic "attribute" {
    for_each = var.attributes
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  dynamic "global_secondary_index" {
    for_each = var.gsi_configs
    content {
      name            = global_secondary_index.value.name
      hash_key        = global_secondary_index.value.hash_key
      range_key       = global_secondary_index.value.range_key
      projection_type = global_secondary_index.value.projection_type
      read_capacity   = global_secondary_index.value.read_capacity
      write_capacity  = global_secondary_index.value.write_capacity
    }
  }

  dynamic "local_secondary_index" {
    for_each = var.lsi_configs
    content {
      name            = local_secondary_index.value.name
      range_key       = local_secondary_index.value.range_key
      projection_type = local_secondary_index.value.projection_type
    }
  }

  server_side_encryption {
    enabled     = var.server_side_encryption_enabled
    kms_key_arn = var.server_side_encryption_kms_key_arn
  }

  point_in_time_recovery {
    enabled = var.point_in_time_recovery_enabled
  }

  ttl {
    attribute_name = var.ttl_attribute_name
    enabled        = var.ttl_enabled
  }

  tags = merge(
    var.common_tags,
    {
      Name        = var.table_name
      Environment = var.environment
      Purpose     = "orders-persistence"
    }
  )

  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      tags,
      global_secondary_index,
      local_secondary_index
    ]
  }
}

resource "aws_dynamodb_table" "orders_stream" {
  count = var.enable_streams ? 1 : 0

  name         = "${var.table_name}-stream"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = var.hash_key_attribute_name
  range_key    = var.range_key_attribute_name

  dynamic "attribute" {
    for_each = var.attributes
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  stream_enabled   = true
  stream_view_type = var.stream_view_type

  server_side_encryption {
    enabled = true
  }

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.table_name}-stream"
      Environment = var.environment
      Purpose     = "orders-change-stream"
    }
  )

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_dynamodb_contributor_insights" "orders" {
  count = var.enable_contributor_insights ? 1 : 0

  table_name = aws_dynamodb_table.orders.name
  status     = "ENABLED"
}

resource "aws_backup_plan" "orders" {
  count = var.enable_backup ? 1 : 0

  name = "${var.table_name}-backup-plan"

  dynamic "rule" {
    for_each = var.backup_rules
    content {
      name              = rule.value.name
      schedule          = rule.value.schedule
      start_window      = rule.value.start_window
      completion_window = rule.value.completion_window
      lifecycle {
        move_to_cold_storage_after_days = rule.value.move_to_cold_storage_after_days
        delete_after_days               = rule.value.delete_after_days
      }
      copy_action {
        destination_vault_arn = rule.value.destination_vault_arn
      }
    }
  }

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.table_name}-backup"
      Environment = var.environment
    }
  )

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_backup_selection" "orders" {
  count = var.enable_backup ? 1 : 0

  name         = "${var.table_name}-backup-selection"
  plan_id      = aws_backup_plan.orders[0].id
  resources    = [aws_dynamodb_table.orders.arn]
  iam_role_arn = var.backup_iam_role_arn

  condition {
    string_like {
      key   = "aws:ResourceTag/Purpose"
      value = "orders-*"
    }
  }
}

resource "aws_kms_key" "dynamodb_table" {
  count = var.server_side_encryption_enabled && var.create_kms_key ? 1 : 0

  description             = "KMS key for DynamoDB table ${var.table_name}"
  deletion_window_in_days = 10
  enable_key_rotation     = var.kms_enable_key_rotation
  key_usage               = "ENCRYPT_DECRYPT"

  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "dynamodb-kms-key-policy"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${var.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "Allow DynamoDB to use the key"
        Effect = "Allow"
        Principal = {
          Service = "dynamodb.amazonaws.com"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey",
          "kms:CreateGrant"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "kms:CallerAccount" = var.account_id
          }
        }
      }
    ]
  })

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.table_name}-kms"
      Environment = var.environment
      Purpose     = "encryption"
    }
  )
}

resource "aws_kms_alias" "dynamodb_table" {
  count = var.server_side_encryption_enabled && var.create_kms_key ? 1 : 0

  name          = "alias/${var.table_name}-${var.environment}"
  target_key_id = aws_kms_key.dynamodb_table[0].key_id
}

resource "aws_cloudwatch_log_group" "dynamodb" {
  count = var.enable_cloudwatch_logs ? 1 : 0

  name              = "/aws/dynamodb/${var.table_name}"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.log_kms_key_id

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.table_name}-logs"
      Environment = var.environment
    }
  )
}

resource "aws_dynamodb_resource_policy" "orders" {
  count = var.enable_resource_policy ? 1 : 0

  table_name = aws_dynamodb_table.orders.name

  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "dynamodb-resource-policy"
    Statement = [
      {
        Sid       = "Allow read access for authenticated users"
        Effect    = "Allow"
        Principal = "*"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.orders.arn,
          "${aws_dynamodb_table.orders.arn}/index/*"
        ]
        Condition = {
          "Bool" : {
            "aws:SecureTransport" : "true"
          }
        }
      }
    ]
  })
}

// === ARCHIVO: infra/modules/dynamodb/outputs.tf ===
output "table_name" {
  description = "Nombre de la tabla DynamoDB de órdenes"
  value       = aws_dynamodb_table.orders.name
}

output "table_arn" {
  description = "ARN de la tabla DynamoDB de órdenes"
  value       = aws_dynamodb_table.orders.arn
}

output "table_id" {
  description = "ID único de la tabla DynamoDB"
  value       = aws_dynamodb_table.orders.id
}

output "table_stream_arn" {
  description = "ARN del stream de la tabla DynamoDB (si está habilitado)"
  value       = try(aws_dynamodb_table.orders_stream[0].stream_arn, null)
}

output "table_stream_label" {
  description = "Etiqueta del stream de la tabla DynamoDB"
  value       = try(aws_dynamodb_table.orders_stream[0].stream_label, null)
}

output "table_arn_suffix" {
  description = "Sufijo del ARN de la tabla DynamoDB"
  value       = aws_dynamodb_table.orders.arn_suffix
}

output "kms_key_arn" {
  description = "ARN de la clave KMS utilizada para el cifrado (si se creó)"
  value       = try(aws_kms_key.dynamodb_table[0].arn, var.server_side_encryption_kms_key_arn)
}

output "kms_key_id" {
  description = "ID de la clave KMS utilizada para el cifrado (si se creó)"
  value       = try(aws_kms_key.dynamodb_table[0].key_id, null)
}

output "backup_plan_id" {
  description = "ID del plan de backup de AWS Backup (si está habilitado)"
  value       = try(aws_backup_plan.orders[0].id, null)
}

output "backup_selection_id" {
  description = "ID de la selección de backup (si está habilitado)"
  value       = try(aws_backup_selection.orders[0].id, null)
}

output "contributor_insights_status" {
  description = "Estado de Contributor Insights (si está habilitado)"
  value       = try(aws_dynamodb_contributor_insights.orders[0].status, null)
}

output "log_group_name" {
  description = "Nombre del grupo de logs de CloudWatch (si está habilitado)"
  value       = try(aws_cloudwatch_log_group.dynamodb[0].name, null)
}

output "resource_policy_id" {
  description = "ID de la política de recursos (si está habilitada)"
  value       = try(aws_dynamodb_resource_policy.orders[0].id, null)
}

output "global_secondary_indexes" {
  description = "Lista de índices secundarios globales y sus estados"
  value = [
    for gsi in aws_dynamodb_table.orders.global_secondary_index : {
      name   = gsi.name
      status = gsi.status
    }
  ]
}

output "local_secondary_indexes" {
  description = "Lista de índices secundarios locales"
  value = [
    for lsi in aws_dynamodb_table.orders.local_secondary_index : {
      name = lsi.name
    }
  ]
}

output "replica_regions" {
  description = "Regiones de réplica configuradas (para tablas globales)"
  value       = aws_dynamodb_table.orders.replica
}

output "tags" {
  description = "Etiquetas aplicadas a la tabla"
  value       = aws_dynamodb_table.orders.tags
}

output "table_size_bytes" {
  description = "Tamaño estimado de la tabla en bytes"
  value       = aws_dynamodb_table.orders.table_size_bytes
}

output "item_count" {
  description = "Cantidad estimada de elementos en la tabla"
  value       = aws_dynamodb_table.orders.item_count
}

// === ARCHIVO: infra/modules/iam/main.tf ===
data "aws_iam_policy_document" "dynamodb_access" {
  statement {
    sid    = "AllowDynamoDBAccess"
    effect = "Allow"

    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:ConditionCheckItem",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:UpdateItem",
      "dynamodb:DescribeTable",
      "dynamodb:DescribeLimits",
      "dynamodb:DescribeTimeToLive",
      "dynamodb:DescribeContinuousBackups",
      "dynamodb:DescribeBackup",
      "dynamodb:ListTagsOfResource",
      "dynamodb:GetItem",
      "dynamodb:UpdateTimeToLive"
    ]

    resources = [
      var.dynamodb_table_arn,
      "${var.dynamodb_table_arn}/index/*"
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["true"]
    }
  }

  statement {
    sid    = "AllowStreamAccess"
    effect = "Allow"

    actions = [
      "dynamodb:DescribeStream",
      "dynamodb:GetRecords",
      "dynamodb:GetShardIterator",
      "dynamodb:ListStreams"
    ]

    resources = [var.dynamodb_stream_arn]
  }

  statement {
    sid    = "AllowKMSDecrypt"
    effect = "Allow"

    actions = [
      "kms:Decrypt",
      "kms:DescribeKey",
      "kms:Encrypt",
      "kms:GenerateDataKey*",
      "kms:ReEncrypt*"
    ]

    resources = [var.kms_key_arn]

    condition {
      test     = "StringLike"
      variable = "kms:ViaService"
      values   = ["dynamodb.*.amazonaws.com"]
    }
  }

  statement {
    sid    = "DenyIAMActions"
    effect = "Deny"

    actions = [
      "dynamodb:DeleteTable",
      "dynamodb:UpdateTable",
      "dynamodb:DeleteItem",
      "dynamodb:*"
    ]

    resources = [var.dynamodb_table_arn]

    condition {
      test     = "StringEquals"
      variable = "aws:RequestedRegion"
      values   = var.restricted_regions
    }

    not_actions = [
      "dynamodb:DescribeTable",
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan"
    ]
  }
}

resource "aws_iam_policy" "dynamodb_access" {
  name        = "${var.policy_name_prefix}-dynamodb-access"
  description = "Política de acceso a DynamoDB para la tabla de órdenes con principio de mínimo privilegio"
  policy      = data.aws_iam_policy_document.dynamodb_access.json

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.policy_name_prefix}-dynamodb-access"
      Environment = var.environment
      Purpose     = "dynamodb-access"
      Module      = "iam"
    }
  )
}

data "aws_iam_policy_document" "dynamodb_readonly" {
  count = var.enable_readonly_policy ? 1 : 0

  statement {
    sid    = "AllowReadOnlyDynamoDBAccess"
    effect = "Allow"

    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:DescribeTable",
      "dynamodb:DescribeTimeToLive",
      "dynamodb:DescribeContinuousBackups",
      "dynamodb:ListTagsOfResource"
    ]

    resources = [
      var.dynamodb_table_arn,
      "${var.dynamodb_table_arn}/index/*"
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["true"]
    }
  }

  statement {
    sid    = "DenyWriteActions"
    effect = "Deny"

    actions = [
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:BatchWriteItem"
    ]

    resources = [var.dynamodb_table_arn]
  }
}

resource "aws_iam_policy" "dynamodb_readonly" {
  count = var.enable_readonly_policy ? 1 : 0

  name        = "${var.policy_name_prefix}-dynamodb-readonly"
  description = "Política de solo lectura a DynamoDB para la tabla de órdenes"
  policy      = data.aws_iam_policy_document.dynamodb_readonly[0].json

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.policy_name_prefix}-dynamodb-readonly"
      Environment = var.environment
      Purpose     = "dynamodb-readonly"
      Module      = "iam"
    }
  )
}

data "aws_iam_policy_document" "dynamodb_writeonly" {
  count = var.enable_writeonly_policy ? 1 : 0

  statement {
    sid    = "AllowWriteOnlyDynamoDBAccess"
    effect = "Allow"

    actions = [
      "dynamodb:BatchWriteItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:DescribeTable"
    ]

    resources = [var.dynamodb_table_arn]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["true"]
    }
  }

  statement {
    sid    = "DenyReadActions"
    effect = "Deny"

    actions = [
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:BatchGetItem"
    ]

    resources = [var.dynamodb_table_arn]
  }
}

resource "aws_iam_policy" "dynamodb_writeonly" {
  count = var.enable_writeonly_policy ? 1 : 0

  name        = "${var.policy_name_prefix}-dynamodb-writeonly"
  description = "Política de solo escritura a DynamoDB para la tabla de órdenes"
  policy      = data.aws_iam_policy_document.dynamodb_writeonly[0].json

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.policy_name_prefix}-dynamodb-writeonly"
      Environment = var.environment
      Purpose     = "dynamodb-writeonly"
      Module      = "iam"
    }
  )
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    sid    = "AllowAssumeRole"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com", "lambda.amazonaws.com", "ecs-tasks.amazonaws.com", "states.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["true"]
    }
  }

  statement {
    sid    = "AllowAssumeRoleWithPrincipalTag"
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = var.trusted_iam_principals
    }

    actions = ["sts:AssumeRole"]

    condition {
      test     = "StringEquals"
      variable = "iam:ResourceTag/${var.principal_tag_key}"
      values   = [var.principal_tag_value]
    }
  }
}

resource "aws_iam_role" "dynamodb_access_role" {
  name                 = "${var.role_name_prefix}-dynamodb-access"
  description          = "Rol de acceso a DynamoDB para la tabla de órdenes"
  assume_role_policy   = data.aws_iam_policy_document.assume_role.json
  max_session_duration = var.max_session_duration

  permissions_boundary = var.permissions_boundary_arn

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.role_name_prefix}-dynamodb-access"
      Environment = var.environment
      Purpose     = "dynamodb-access"
      Module      = "iam"
    }
  )

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_iam_role_policy_attachment" "dynamodb_access_attach" {
  role       = aws_iam_role.dynamodb_access_role.name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}

resource "aws_iam_role_policy_attachment" "dynamodb_readonly_attach" {
  count = var.enable_readonly_policy ? 1 : 0

  role       = aws_iam_role.dynamodb_access_role.name
  policy_arn = aws_iam_policy.dynamodb_readonly[0].arn
}

resource "aws_iam_role_policy_attachment" "dynamodb_writeonly_attach" {
  count = var.enable_writeonly_policy ? 1 : 0

  role       = aws_iam_role.dynamodb_access_role.name
  policy_arn = aws_iam_policy.dynamodb_writeonly[0].arn
}

resource "aws_iam_instance_profile" "dynamodb_access" {
  count = var.create_instance_profile ? 1 : 0

  name = "${var.role_name_prefix}-dynamodb-access"
  role = aws_iam_role.dynamodb_access_role.name

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.role_name_prefix}-dynamodb-access"
      Environment = var.environment
      Module      = "iam"
    }
  )
}

resource "aws_iam_user" "dynamodb_operator" {
  count = var.create_iam_user ? 1 : 0

  name = "${var.user_name_prefix}-dynamodb-operator"
  path = "/operators/"

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.user_name_prefix}-dynamodb-operator"
      Environment = var.environment
      Purpose     = "dynamodb-operator"
      Module      = "iam"
    }
  )
}

resource "aws_iam_user_policy_attachment" "dynamodb_operator_attach" {
  count = var.create_iam_user ? 1 : 0

  user       = aws_iam_user.dynamodb_operator[0].name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}

resource "aws_iam_access_key" "dynamodb_operator" {
  count = var.create_iam_user && var.create_access_key ? 1 : 0

  user = aws_iam_user.dynamodb_operator[0].name

  pgp_key = var.pgp_key

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.user_name_prefix}-dynamodb-operator"
      Environment = var.environment
      Module      = "iam"
    }
  )
}

resource "aws_iam_policy" "deny_delete_table" {
  name        = "${var.policy_name_prefix}-deny-delete-table"
  description = "Política para denegar la eliminación de la tabla DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "DenyDeleteTable"
        Effect   = "Deny"
        Action   = "dynamodb:DeleteTable"
        Resource = var.dynamodb_table_arn
      },
      {
        Sid      = "DenyDeleteTableIndex"
        Effect   = "Deny"
        Action   = "dynamodb:DeleteTable"
        Resource = "${var.dynamodb_table_arn}/index/*"
      }
    ]
  })

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.policy_name_prefix}-deny-delete-table"
      Environment = var.environment
      Purpose     = "prevent-accidental-deletion"
      Module      = "iam"
    }
  )
}

resource "aws_iam_role_policy_attachment" "deny_delete_attach" {
  role       = aws_iam_role.dynamodb_access_role.name
  policy_arn = aws_iam_policy.deny_delete_table.arn
}

resource "aws_iam_role" "cross_account_access_role" {
  count = var.create_cross_account_role ? 1 : 0

  name                 = "${var.role_name_prefix}-cross-account-dynamodb"
  description          = "Rol de acceso entre cuentas a DynamoDB"
  max_session_duration = var.max_session_duration

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          AWS = var.cross_account_principal_arn
        }
        Condition = {
          StringEquals = {
            "sts:ExternalId" = var.external_id
          }
        }
      }
    ]
  })

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.role_name_prefix}-cross-account-dynamodb"
      Environment = var.environment
      Purpose     = "cross-account-access"
      Module      = "iam"
    }
  )
}

resource "aws_iam_role_policy_attachment" "cross_account_dynamodb_attach" {
  count = var.create_cross_account_role ? 1 : 0

  role       = aws_iam_role.cross_account_access_role[0].name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}

resource "aws_iam_policy" "tagging_policy" {
  count = var.enable_tagging_policy ? 1 : 0

  name        = "${var.policy_name_prefix}-tagging"
  description = "Política para permitir únicamente operaciones de etiquetado en DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowTagOperations"
        Effect = "Allow"
        Action = [
          "dynamodb:TagResource",
          "dynamodb:UntagResource",
          "dynamodb:ListTagsOfResource"
        ]
        Resource = var.dynamodb_table_arn
      }
    ]
  })

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.policy_name_prefix}-tagging"
      Environment = var.environment
      Purpose     = "tagging-access"
      Module      = "iam"
    }
  )
}

resource "aws_iam_role_policy_attachment" "tagging_policy_attach" {
  count = var.enable_tagging_policy ? 1 : 0

  role       = aws_iam_role.dynamodb_access_role.name
  policy_arn = aws_iam_policy.tagging_policy[0].arn
}

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  dynamodb-local:
    image: "amazon/dynamodb-local:2.5.2"
    command: ["-jar","DynamoDBLocal.jar","-sharedDb","-inMemory"]
    ports:
      - "127.0.0.1:8000:8000"
    healthcheck:
      test: ["CMD-SHELL","bash -c ':> /dev/tcp/127.0.0.1/8000' || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 5s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| DynamoDB Local | `amazon/dynamodb-local:2.5.2` | 8000 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/dynamodb/create-tables.sh ===
#!/usr/bin/env bash
# Crea las tablas en DynamoDB Local (idempotente). Credenciales dummy: DynamoDB Local no valida firmas.
set -euo pipefail

export AWS_ACCESS_KEY_ID=local
export AWS_SECRET_ACCESS_KEY=local
export AWS_REGION=us-east-1
ENDPOINT="${DYNAMODB_ENDPOINT:-http://localhost:8000}"

create_table() {
  local name="$1" pk="$2" sk="${3:-}"
  if aws dynamodb describe-table --table-name "$name" --endpoint-url "$ENDPOINT" >/dev/null 2>&1; then
    echo "Tabla $name ya existe"
    return
  fi
  local attrs="AttributeName=$pk,AttributeType=S"
  local keys="AttributeName=$pk,KeyType=HASH"
  if [ -n "$sk" ]; then
    attrs="$attrs AttributeName=$sk,AttributeType=S"
    keys="$keys AttributeName=$sk,KeyType=RANGE"
  fi
  # shellcheck disable=SC2086
  aws dynamodb create-table --table-name "$name" --attribute-definitions $attrs --key-schema $keys \
    --billing-mode PAY_PER_REQUEST --endpoint-url "$ENDPOINT" >/dev/null
  echo "Tabla $name creada"
}

create_table "app-items" "id"

```
