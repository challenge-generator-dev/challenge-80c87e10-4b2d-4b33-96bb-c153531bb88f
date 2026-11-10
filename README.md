# Implementación CRUD de ordenes en DynamoDB

La empresa necesita gestionar ordenes de compra de manera eficiente. El sistema debe permitir la creación, lectura, actualización y eliminación de ordenes almacenadas en DynamoDB. La interfaz de usuario debe interactuar con DynamoDB para realizar estas operaciones. El candidato debe implementar las operaciones CRUD y versionar la infraestructura utilizando Terraform.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Persistir ordenes en DynamoDB desde la interfaz |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 1 semana |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Crear orden

**Objetivo:** Implementar la funcionalidad para crear una nueva orden en DynamoDB.

**Tiempo estimado:** 2 días

**Instrucciones:**

- Identificar los atributos necesarios para una orden (ID, cliente, productos, fecha, estado).
- Diseñar la estructura de la orden en DynamoDB.
- Implementar la lógica para crear una nueva orden desde la interfaz.

**Entregable:** Interfaz de usuario funcional para crear ordenes y registro de la orden en DynamoDB.

<details>
<summary>Pistas de conocimiento</summary>

- Utilizar Terraform para versionar la infraestructura de DynamoDB.
- Asegurar que la creación de ordenes no duplique IDs.

</details>

### Fase 2: Leer orden

**Objetivo:** Implementar la funcionalidad para leer una orden existente en DynamoDB.

**Tiempo estimado:** 2 días

**Instrucciones:**

- Diseñar la consulta para obtener una orden por ID.
- Implementar la lógica para mostrar la orden en la interfaz.

**Entregable:** Interfaz de usuario funcional para leer ordenes y consulta en DynamoDB para obtener ordenes por ID.

<details>
<summary>Pistas de conocimiento</summary>

- Utilizar Terraform para versionar la infraestructura de DynamoDB.
- Manejar posibles errores al leer ordenes.

</details>

### Fase 3: Actualizar orden

**Objetivo:** Implementar la funcionalidad para actualizar una orden existente en DynamoDB.

**Tiempo estimado:** 2 días

**Instrucciones:**

- Diseñar la lógica para actualizar los atributos de una orden.
- Implementar la lógica para actualizar la orden desde la interfaz.

**Entregable:** Interfaz de usuario funcional para actualizar ordenes y lógica para actualizar ordenes en DynamoDB.

<details>
<summary>Pistas de conocimiento</summary>

- Utilizar Terraform para versionar la infraestructura de DynamoDB.
- Asegurar consistencia en la actualización de ordenes.

</details>

### Fase 4: Eliminar orden

**Objetivo:** Implementar la funcionalidad para eliminar una orden existente en DynamoDB.

**Tiempo estimado:** 2 días

**Instrucciones:**

- Diseñar la lógica para eliminar una orden por ID.
- Implementar la lógica para eliminar la orden desde la interfaz.

**Entregable:** Interfaz de usuario funcional para eliminar ordenes y lógica para eliminar ordenes en DynamoDB.

<details>
<summary>Pistas de conocimiento</summary>

- Utilizar Terraform para versionar la infraestructura de DynamoDB.
- Asegurar que la eliminación de ordenes no afecte a otras entidades relacionadas.

</details>

## Dimensiones Evaluadas

- **queEs**: En la fase 1, ¿cuáles son los atributos necesarios para una orden?
- **paraQueSirve**: En la fase 2, ¿para qué sirve la consulta para obtener una orden por ID?
- **comoSeUsa**: En la fase 3, ¿cómo se usa la lógica para actualizar los atributos de una orden?
- **erroresComunes**: En la fase 2, ¿cuáles son los errores comunes al leer ordenes y cómo los manejas?
- **queDecisionesImplica**: En la fase 4, ¿qué decisiones implica la eliminación de una orden y cómo las tomas?

## Criterios de Evaluacion

- Implementación de la funcionalidad para crear una orden en DynamoDB.
- Implementación de la funcionalidad para leer una orden en DynamoDB.
- Implementación de la funcionalidad para actualizar una orden en DynamoDB.
- Implementación de la funcionalidad para eliminar una orden en DynamoDB.
- Uso de Terraform para versionar la infraestructura de DynamoDB.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

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

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
