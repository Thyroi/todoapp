# Explicacion

## Objetivo

Este archivo sirve como bitácora simple de aprendizaje del proyecto.

La idea es documentar:
- qué se configuró
- en qué archivo vive
- para qué sirve
- un ejemplo corto de uso o impacto

---

## Bloque 1: Scripts y package.json

### Archivo principal
- `package.json`

### Qué es
`package.json` es el panel de control operativo del proyecto.

No solo guarda dependencias. También define cómo:
- se ejecuta la app
- se valida el código
- se formatea
- se revisan tipos
- se trabaja con Prisma
- se inicializa parte de la base de datos

### Scripts importantes

#### `dev`
- Uso: levantar el proyecto en desarrollo.
- Ejemplo:
```bash
npm run dev
```

#### `build`
- Uso: compilar la app para producción.
- Ejemplo:
```bash
npm run build
```

#### `lint`
- Uso: revisar reglas de calidad del código.
- Ejemplo:
```bash
npm run lint
```

#### `lint:fix`
- Uso: intentar corregir automáticamente problemas corregibles por ESLint.
- Ejemplo:
```bash
npm run lint:fix
```

#### `format`
- Uso: formatear el código con Prettier.
- Ejemplo:
```bash
npm run format
```

#### `format:check`
- Uso: revisar si el proyecto ya cumple el formato esperado sin modificar archivos.
- Ejemplo:
```bash
npm run format:check
```

#### `type-check`
- Uso: revisar errores de tipos con TypeScript.
- Ejemplo:
```bash
npm run type-check
```

#### `prisma:generate`
- Uso: generar el cliente tipado de Prisma a partir del schema.
- Ejemplo:
```bash
npm run prisma:generate
```

#### `prisma:migrate`
- Uso: crear/aplicar migraciones de base de datos en desarrollo.
- Ejemplo:
```bash
npm run prisma:migrate
```

#### `prisma:studio`
- Uso: abrir la interfaz visual de Prisma para revisar la base de datos.
- Ejemplo:
```bash
npm run prisma:studio
```

#### `prisma:seed`
- Uso: cargar datos iniciales.
- En este proyecto: rutinas globales de pomodoro.
- Ejemplo:
```bash
npm run prisma:seed
```

#### `db:setup`
- Uso: ejecutar un flujo base de base de datos con un solo comando.
- Qué hace:
  - genera cliente Prisma
  - corre migraciones
  - corre seed
- Ejemplo:
```bash
npm run db:setup
```

### Diferencia importante

#### `prisma`
- Herramienta de desarrollo.
- Se usa para:
  - migraciones
  - generación del cliente
  - validación del schema
  - Prisma Studio

#### `@prisma/client`
- Cliente que usa el código de la app para consultar la base de datos.

### Idea clave del bloque
`package.json` no es solo un archivo de paquetes; es la interfaz de trabajo del proyecto.

---

## Bloque 2: Configuración de editor, formato y lint

### Archivos principales
- `.editorconfig`
- `prettier.config.mjs`
- `.prettierignore`
- `eslint.config.mjs`

---

### `.editorconfig`

#### Archivo
- `.editorconfig`

#### Para qué sirve
Le dice al editor cómo comportarse con reglas básicas del archivo.

Ayuda a estandarizar:
- indentación
- tamaño de indentación
- charset
- fin de línea
- espacios sobrantes
- salto de línea final

#### Qué no hace
No revisa semántica ni calidad del código.
No reemplaza a ESLint ni a TypeScript.

#### Reglas actuales importantes
- `charset = utf-8`
- `end_of_line = lf`
- `indent_style = space`
- `indent_size = 2`
- `insert_final_newline = true`
- `trim_trailing_whitespace = true`

#### Ejemplo de impacto
Si alguien usa otro editor o sistema operativo, `.editorconfig` ayuda a evitar que:
- unos archivos usen tabs
- otros usen espacios
- unos queden con `CRLF`
- otros con `LF`

Eso reduce ruido en git y ayuda a que Prettier trabaje sobre una base más estable.

---

### `prettier.config.mjs`

#### Archivo
- `prettier.config.mjs`

#### Para qué sirve
Define el formato automático del código.

#### Reglas actuales importantes
- `semi: true`
- `singleQuote: false`
- `trailingComma: "all"`
- `printWidth: 88`

#### Qué resuelve
Evita que cada archivo tenga un estilo visual diferente.

#### Ejemplo
Sin Prettier, una persona podría escribir:
```ts
const user={name:"Ana",age:20}
```

Y otra:
```ts
const user = {
    name: "Ana",
    age: 20
}
```

Con Prettier, ambos terminan en una misma forma consistente.

---

## Bloque 11: Ayuda contextual y tono consistente en formularios

### Objetivo
Hacer que el dashboard explique mejor cada campo sin llenar la interfaz de texto permanente.

### Decisión de UX
En vez de agregar descripciones largas debajo de cada input, se creó una ayuda contextual reutilizable:
- label claro
- icono sutil de ayuda
- tooltip corto con intención operativa

Eso permite que la UI siga limpia, pero sin dejar al usuario adivinando para qué sirve cada campo.

### Dónde vive
- `src/features/dashboard/components/field-help-icon.tsx`
- `src/features/dashboard/constants.ts`

### Cómo funciona
`constants.ts` ahora concentra metadatos de campos para tres grupos:
- tasks
- pomodoro plans
- routines

Cada entrada define:
- `label`
- `helpText`

Con eso, los formularios y editores inline pueden renderizar una misma gramática visual sin duplicar textos a mano en cada componente.

### Dónde se aplicó
- creación de task
- edición inline de task
- creación de routine
- edición inline de routine
- configuración de pomodoro plan
- encabezado del timer

### Ajuste final de copy
En la última pasada también se corrigieron placeholders para que el tono coincida con las ayudas:
- más directos
- más operativos
- menos genéricos

Ejemplos:
- `Task title` pasó a `Name the task`
- `Routine name` pasó a `Name the routine`
- `Search task` pasó a `Search by task title`

### Idea clave del bloque
Una ayuda buena no compite con la interfaz; aparece justo cuando hace falta y usa el mismo lenguaje que el resto del sistema.

---

## Bloque 3: Reorganización visual del dashboard

### Archivos principales
- `src/features/dashboard/components/dashboard-view.tsx`
- `src/features/dashboard/components/dashboard-main.tsx`
- `src/features/dashboard/components/dashboard-sidebar.tsx`

### Objetivo del cambio
Separar mejor el contenido principal del dashboard para que la experiencia sea más clara.

La nueva idea base es:
- el `Header` queda intacto arriba
- debajo del header aparece una grilla de 2 columnas
- la columna principal usa proporción `3fr`
- la columna secundaria usa proporción `1fr`

### Qué vive ahora en cada columna

#### Columna principal `3/4`
- `TasksSection`

Esta columna queda dedicada a tareas.

Después del cambio de modales, el alta de tareas ya no queda fija dentro de la columna; ahora cuelga del botón `New task` dentro de `TasksSection`.

#### Columna secundaria `1/4`
- `TimerSection`
- `RoutinesSection`
- `CreateRoutineSection`

Esta columna agrupa herramientas de apoyo y presets.

### Por qué mejora el UX
Antes, la UI mezclaba creación de tareas en un lado y listado de tareas en otro, mientras la lista de rutinas vivía en la columna grande.

Eso hacía que el flujo mental de `crear tarea -> ver tarea -> operar tarea` estuviera partido.

Con esta reorganización:
- el flujo de tareas queda concentrado en una sola zona principal
- la columna secundaria funciona como panel de apoyo
- la jerarquía visual se siente más predecible

### Detalle técnico importante
La grilla quedó con esta lógica:

```tsx
<section className="grid items-start gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
```

Eso significa que:
- en pantallas pequeñas sigue apilado verticalmente
- en `xl` pasa a dos columnas con proporción 3 a 1

### Idea clave del bloque
Una mejora de UX muchas veces no exige rediseñar todo; primero hay que corregir la jerarquía y agrupar por intención de uso.

---

## Bloque 4: Sistema base de modales para tasks y pomodoro plan

### Archivos principales
- `src/components/ui/modal.tsx`
- `src/components/ui/tooltip.tsx`
- `src/features/dashboard/components/tasks-section.tsx`
- `src/features/dashboard/components/create-task-section.tsx`
- `src/features/dashboard/components/task-plan-card.tsx`

### Qué problema se corrigió
Había dos fricciones claras:
- el formulario de crear task ocupaba espacio permanente dentro de la columna principal
- cada task mostraba inline el formulario de pomodoro plan, lo que ensuciaba mucho la card

### Nueva decisión de UX

#### Crear task
El formulario ya no vive fijo en pantalla.

Ahora `TasksSection` tiene un botón cuadrado con `+` que abre un modal.

Ese botón además tiene tooltip con el texto `Create a new task`.

Ventaja:
- la lista de tasks respira mejor
- el usuario entra al formulario solo cuando realmente quiere crear una nueva task

#### Asignar pomodoro plan
Cada card ahora muestra un botón visual de tomate.

Ese botón:
- tiene tooltip con el texto `Assign pomodoro plan`
- abre un modal con los mismos campos del plan
- evita que cada task quede expandida por defecto con más inputs de los necesarios

### Por qué se creó una base reusable
En vez de meter un modal artesanal dentro de cada componente, se creó una pieza genérica en `src/components/ui/modal.tsx`.

Eso permite reutilizar el mismo patrón después para:
- editar notas en modal
- confirmar borrados
- editar rutinas sin romper la composición actual

### Detalle técnico importante
Para cerrar el modal solo cuando la operación realmente funciona, `runMutation` ahora devuelve un booleano:

- `true` si la operación terminó bien
- `false` si falló y ya se mostró un toast de error

Con eso, el modal no se cierra por accidente cuando una request falla.

### Idea clave del bloque
Mover formularios secundarios a modales no es solo una mejora visual; también reduce ruido cognitivo y devuelve protagonismo a la acción principal de la pantalla.

---

## Bloque 5: Rediseño de la task card

### Archivos principales
- `src/features/dashboard/components/task-editor.tsx`
- `src/features/dashboard/components/task-card.tsx`
- `src/features/dashboard/components/task-plan-card.tsx`
- `src/features/dashboard/utils/task-meta.ts`

### Problema de UX
La task card estaba siempre en modo edición completa.

Eso causaba tres problemas:
- el título y la descripción no se leían como contenido, sino como formulario
- el estado y la prioridad no tenían jerarquía visual clara
- las acciones importantes quedaban mezcladas sin una intención evidente

### Nueva estructura

#### Fila principal
Ahora la card tiene una fila principal compacta, pensada como una sola línea lógica de trabajo.

Sus columnas son:
- título y descripción
- estado actual en pill + selector de estado
- prioridad actual en pill + selector de prioridad
- botones de interacción

Se eliminaron los recuadros intermedios que estaban metiendo ruido visual.

#### Modo edición
El botón de lápiz activa la edición del contenido textual.

Cuando eso pasa:
- `title` se convierte en input completo
- `description` se convierte en textarea
- aparecen botones `Save` y `Cancel`

`Cancel` restaura el draft local al estado real de la task.

### Color semántico en pills
Se creó una pequeña capa de metadatos en `src/features/dashboard/utils/task-meta.ts`.

Eso centraliza:
- el label legible de cada estado
- el color visual de cada pill
- el tono visual del selector asociado

Así la UI mantiene consistencia cuando cambia el estado o la prioridad.

### Acción de borrado
Se añadió un botón de caneca para eliminar la task directamente desde la card.

Los iconos de edición y borrado ya no viven inline dentro del componente.

Ahora:
- los SVG viven en `public/icons`
- los botones usan color por estado visual
- el icono hereda color y en hover pasa a blanco sobre fondo sólido

Esto reduce ruido dentro de `task-editor.tsx` y deja la lógica visual más limpia.

### Acción de pomodoro
Ya no existe una sección aparte de pomodoro dentro de la card.

Ahora solo hay un botón en la columna de acciones:
- si no hay plan, el botón vuelve a mostrarse como tomate con tooltip `Assign pomodoro plan`
- si ya existe plan, el botón principal pasa a indicar que el timer puede iniciarse desde ahí

La segunda fila queda reservada para `notes`.

Además, la fila de descripción de la task ahora tiene una altura más controlada:
- en lectura usa una caja visual estable
- en edición el textarea y la columna de acciones se equilibran mejor

Eso evita que una descripción muy larga deforme demasiado la altura general de la card.

La fila de `notes` sigue la misma idea:
- lista de notas en una zona estable con scroll interno
- área de escritura separada y más predecible
- el borrado de notas también usa icono de caneca en vez de texto plano

Con eso, la card completa cambia menos de altura entre una tarea y otra.

En el pulido final de layout se ajustó además:
- la fila principal del editor solo se estira a 4 columnas en pantallas muy anchas
- los botones principales (`Save`, `Cancel`, `Add Note`, `Start timer`) comparten mejor escala visual
- la card completa ganó un espaciado y una sombra más controlados para sentirse más consistente entre desktop y responsive

Además se añadió una capa de seguridad y feedback:
- confirmación antes de borrar una task
- confirmación antes de borrar una note
- loader visible durante el borrado para que la UI no parezca congelada
- animación sutil de entrada para modales y task cards
- selects con aspecto más cercano a celdas operativas que a formularios sueltos

## Bloque 6: Rutinas como workspace propio

### Objetivo
Las rutinas dejaron de vivir como bloques secundarios en el sidebar.

Ahora tienen un workspace propio que reemplaza la vista de tasks cuando el usuario cambia de contexto desde el dashboard principal.

### Qué cambió
- `DashboardMain` ahora tiene un switch entre `Tasks` y `Routines`
- `DashboardSidebar` queda enfocada en el timer
- la creación de rutinas se mueve a un modal con botón `+`
- las cards de rutina se rediseñan con un lenguaje visual cercano al de tasks

### Nueva experiencia de rutinas
- vista dedicada para explorar rutinas
- botón `+` para crear una nueva rutina
- cards con resumen rápido de tiempos y ciclos
- edición explícita con `edit`
- confirmación y loader al borrar una rutina
- clonación de presets globales hacia el modal de creación

### Unificación visual de botones
Las acciones primarias pasan a negro para mantener coherencia con el resto del dashboard.

Eso afecta, entre otras cosas:
- creación de task
- guardado de pomodoro plan
- `Start timer`
- guardado de rutina

### Idea clave del bloque
Si tasks y routines son dos unidades de trabajo distintas, no deben competir dentro del mismo lienzo; deben sentirse como workspaces hermanos con la misma gramática visual.

## Bloque 7: Transición de workspace, filtros de rutinas y timer refinado

### Qué se añadió
- transición visual al cambiar entre `Tasks` y `Routines`
- filtros `All / Mine / Global` dentro del workspace de rutinas
- bloque de timer con más jerarquía visual y mejor lectura operacional

### Workspace switch
El cambio entre workspaces ya no es seco.

Ahora el contenido entra con una animación corta que ayuda a entender que el usuario cambió de contexto, no solo de bloque visual.

### Filtros de rutinas
Dentro de `Routines` ahora existe un filtro por ownership:
- `All`
- `Mine`
- `Global`

Eso reduce ruido cuando ya existan muchos presets y separa mejor lo editable de lo compartido.

### Timer refinado
El timer ya no es solo un bloque oscuro con tiempo.

Ahora muestra mejor:
- tarea activa
- rutina usada
- fase actual
- ciclos completados
- modo del timer

La intención es que el usuario pueda escanear el estado del foco en segundos.

### Idea clave del bloque
Una buena UX no solo organiza pantallas; también marca las transiciones entre contextos y reduce el esfuerzo para entender qué puede editarse, qué está activo y qué pertenece al sistema compartido.

## Bloque 8: Timer como entrada a rutinas y task seleccionada arriba

### Cambio estructural
Se eliminó el selector de workspace como bloque independiente dentro del contenido.

Ahora el dashboard trabaja en una sola columna:
- timer arriba
- contenido principal abajo

El acceso a `Routines` nace desde el timer con un botón de configuración. Eso hace que la navegación se sienta más natural: primero veo el motor de foco, luego configuro sus presets.

### Tasks como lista compacta + detalle activo
La sección de tasks dejó de mostrar descripción y notas en todas las cards al mismo tiempo.

Ahora funciona así:
- la lista normal queda compacta
- cada row muestra lo esencial
- cuando seleccionas una task, aparece arriba desplegada
- solo esa task muestra descripción y notas

Esto no es un acordeón clásico, porque el detalle no vive exactamente adentro de la fila; vive arriba como contexto activo.

### Borde por status en tasks colapsadas
Las tasks colapsadas ahora usan el borde izquierdo para comunicar estado.

Eso permite escanear la lista rápido sin abrir cada card.

### Ajuste en rutinas
Cuando entras a `Routines`, el botón secundario ya no refresca; ahora devuelve a `Tasks`, porque ese flujo encaja mejor con el nuevo modelo de navegación.

### Idea clave del bloque
Si solo una task necesita atención profunda a la vez, la interfaz debe tratarla como contexto activo y dejar el resto como lista operativa de baja fricción.

## Bloque 9: Refactor por lectura y jerarquía de componentes

### Problema
Varios componentes del dashboard habían crecido demasiado y ya costaba responder preguntas básicas como:
- cuál es el padre real
- dónde empieza el header visual
- dónde viven las acciones
- qué bloque pertenece al modal y cuál al contenido

### Decisión
Se partieron los componentes grandes en piezas más pequeñas y con responsabilidad única.

Ejemplos:
- `task-editor` ahora delega en header, body y delete modal
- `routine-card` ahora delega en header, métricas, editor y delete modal
- `routines-workspace` separa header y filtro
- `timer-panel` separa chips de estado, bloque de sesión y métricas

### Beneficio
Ahora la lectura del árbol visual coincide mucho mejor con el árbol real de componentes.

Eso reduce el costo de mantenimiento y hace más rápido entender qué pieza tocar cuando cambie el diseño.

### Idea clave del bloque
Cuando un componente ya no cabe cómodamente en la cabeza, dejó de ser un componente y pasó a ser un contenedor de varios problemas distintos.

## Bloque 10: Rutinas sin clonado y con acciones al final

### Cambio funcional
Se eliminó la lógica de clonar rutinas desde presets globales.

La razón es simple: el flujo aportaba poco valor y añadía ruido mental, tanto en la interfaz como en la arquitectura.

### Cambio visual
La card de rutina volvió a un orden más claro:
- identidad de la rutina
- métricas
- action buttons al final

Eso mejora el escaneo porque primero lees la información y luego decides si ejecutar una acción.

### Limpieza interna
También se eliminó la lógica muerta de clone en el dominio de rutinas para que el controller no siga exponiendo acciones que ya no existen en la UX.

### Idea clave del bloque
Si una acción no aporta suficiente valor real al flujo, termina costando más en complejidad estructural de lo que devuelve en utilidad.

### Idea clave del bloque
Una task card operativa no necesita subpaneles para cada cosa; necesita una fila principal clara con acciones directas y una fila secundaria solo para información auxiliar.

---

### `.prettierignore`

#### Archivo
- `.prettierignore`

#### Para qué sirve
Le dice a Prettier qué archivos o carpetas no debe tocar.

#### Casos del proyecto
- `.next`
- `coverage`
- `node_modules`
- `package-lock.json`
- `src/generated`

#### Por qué `src/generated`
Porque es código generado por Prisma.
No es código que debamos editar o formatear manualmente.
Además puede ser voluminoso y generar ruido innecesario.

---

### `eslint.config.mjs`

#### Archivo
- `eslint.config.mjs`

#### Para qué sirve
ESLint revisa calidad, reglas y patrones dudosos del código.

#### Qué se está usando
- configuración de Next
- configuración de TypeScript para Next
- desactivación de conflictos de formato con Prettier
- reglas manuales del proyecto
- ignores globales

#### Regla manual importante
- `no-console` está en warning, permitiendo `console.warn` y `console.error`

#### Por qué está como warning y no error
Porque queremos que el desarrollador vea el problema, pero sin bloquear por completo el flujo mientras la base del proyecto todavía está creciendo.

La idea es:
- `console.log` suele ser ruido temporal
- `console.warn` y `console.error` pueden seguir teniendo utilidad real

#### Ejemplo
Esto debería avisar:
```ts
console.log("debug temporal");
```

Esto sí se permite:
```ts
console.error("fallo al cargar tareas");
```

---

### Relación entre herramientas

#### `.editorconfig`
Controla reglas básicas del archivo y del editor.

#### `Prettier`
Controla formato visual.

#### `ESLint`
Controla reglas de calidad y patrones problemáticos.

#### `TypeScript`
Controla tipos.

### Idea clave del bloque
Una buena configuración separa responsabilidades.
No mete herramientas a hacer el trabajo de otra.

---

## Notas de aprendizaje

### Lo aprendido hasta ahora
- `lint` y `format` no son lo mismo
- `.editorconfig` no reemplaza a ESLint
- `prisma` y `@prisma/client` cumplen roles distintos
- `src/generated` no es fuente manual del proyecto
- una configuración buena reduce fricción y ruido

---

## Bloque 3: Prisma, schema, env y decisiones de dominio

### Archivos principales
- `prisma.config.ts`
- `prisma/schema.prisma`
- `.env`
- `.env.example`
- `src/lib/prisma.ts`
- `prisma/seed.ts`

---

### `prisma.config.ts`

#### Archivo
- `prisma.config.ts`

#### Para qué sirve
No define el modelo de datos.
Define cómo Prisma trabaja dentro del proyecto.

#### Qué controla
- dónde está el schema
- dónde viven las migraciones
- de dónde sale la conexión a la base de datos

#### Idea clave
- `schema.prisma` define qué es la base de datos
- `prisma.config.ts` define cómo Prisma usa esa base dentro del repo

---

### `.env` y `.env.example`

#### Archivos
- `.env`
- `.env.example`

#### Diferencia

##### `.env`
- contiene valores reales del entorno local
- no se debe commitear

##### `.env.example`
- contiene una plantilla de variables necesarias
- sí se puede compartir
- documenta qué necesita el proyecto para correr

#### Variables actuales importantes
- `DATABASE_URL`
- `JWT_SECRET`

#### Idea clave
La configuración sensible no se mezcla con el código fuente.

---

### `schema.prisma`

#### Archivo
- `prisma/schema.prisma`

#### Para qué sirve
Define el modelo de datos del proyecto.

Aquí se decide:
- qué entidades existen
- cómo se relacionan
- qué campos son opcionales u obligatorios
- qué restricciones tiene la base
- qué índices se agregan

---

### Enums

#### Archivo
- `prisma/schema.prisma`

#### Qué hacen
`TaskStatus` y `TaskPriority` limitan los valores válidos que puede guardar la base.

#### Por qué no usar strings libres
Porque los strings libres permiten inconsistencias como:
- mayúsculas distintas
- errores de tipeo
- mezclar idioma del frontend con datos persistidos

#### Ejemplo
Mejor esto:
```prisma
enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}
```

Que esto conceptualmente:
```txt
"sin iniciar"
"Sin iniciar"
"pending"
"todo"
```

---

### `User`

#### Archivo
- `prisma/schema.prisma`

#### Decisión importante
Se usa `passwordHash` y no `password`.

#### Por qué
Porque el nombre debe reflejar la realidad del dato guardado.
No se guarda contraseña en texto plano; se guarda un hash.

---

### `Task`

#### Archivo
- `prisma/schema.prisma`

#### Decisiones importantes
- la tarea pertenece a un usuario
- la tarea puede existir sin plan pomodoro
- la tarea tiene muchas notas

#### Por qué `pomodoroPlan` es opcional
Porque una tarea puede existir como simple todo y luego recibir un plan.

#### Índice actual
```prisma
@@index([userId, status])
```

#### Qué favorece
Consultas como:
- tareas de un usuario
- tareas de un usuario por estado

---

### `PomodoroRoutine`

#### Archivo
- `prisma/schema.prisma`

#### Para qué sirve
Representa una plantilla reusable de pomodoro.

#### Decisión importante
`userId` es nullable.

#### Regla del dominio
- `userId = null` significa rutina global
- `userId != null` significa rutina creada por un usuario

#### Por qué esto no es solo técnico
Porque expresa una regla real del producto: existen rutinas globales y rutinas privadas.

#### Restricción actual
```prisma
@@unique([name, userId])
```

#### Qué evita
Que un mismo usuario cree varias rutinas con exactamente el mismo nombre.

---

### `PomodoroPlan`

#### Archivo
- `prisma/schema.prisma`

#### Para qué sirve
Define cómo una tarea concreta usa una rutina concreta.

#### Ejemplo conceptual
- rutina: `25/5`
- plan: esta tarea usará esa rutina durante `4` ciclos

#### Restricción clave
```prisma
taskId String @unique
```

#### Qué significa realmente
Cada tarea puede tener como máximo un solo plan pomodoro en el MVP.

Eso no es solo sintaxis.
Eso expresa una decisión del dominio.

---

### `Note`

#### Archivo
- `prisma/schema.prisma`

#### Para qué sirve
Representa notas escritas sobre una tarea.

#### Regla actual
Cada nota pertenece a una sola tarea.

#### Índice actual
```prisma
@@index([taskId, createdAt])
```

#### Qué favorece
Consultas como:
- ver notas de una tarea
- ordenarlas por creación

---

### `src/lib/prisma.ts`

#### Archivo
- `src/lib/prisma.ts`

#### Para qué sirve
Centraliza la creación del cliente de Prisma en la aplicación.

#### Por qué existe
Evita crear clientes de Prisma en muchos archivos y repetir configuración.

#### Idea clave
Queremos una sola puerta de acceso a la base de datos desde la app.

---

### `prisma/seed.ts`

#### Archivo
- `prisma/seed.ts`

#### Para qué sirve
Carga datos iniciales del sistema.

#### En este proyecto
Carga rutinas globales de pomodoro.

#### Por qué importa
No es solo comodidad del desarrollador.
Es parte del producto, porque el sistema asume que existen rutinas por defecto.

---

## Preguntas de diseño que salieron del schema

### ¿Deberíamos indexar `title` o `description` en `Task`?

#### Respuesta corta
No automáticamente.

#### Por qué
Un índice normal sirve bien para filtros exactos o prefijos, pero búsqueda real de texto suele necesitar otra estrategia.

#### Si el objetivo es búsqueda por texto
Opciones más sanas después:
- búsqueda simple por `title`
- búsqueda full-text en PostgreSQL
- una estrategia combinada según crecimiento del producto

#### Recomendación para MVP
- no indexar `description` todavía
- considerar búsqueda por `title` cuando se implemente el caso de uso real

---

### ¿El nombre de `PomodoroRoutine` debería ser opcional?

#### Respuesta corta
Mi recomendación sigue siendo: no.

#### Por qué
Aunque al usuario pueda darle pereza nombrarla, el nombre ayuda a:
- identificarla en listas
- seleccionarla en formularios
- diferenciar rutinas personalizadas

#### Mejor solución
Si quieres menos fricción, genera un nombre por defecto.

#### Ejemplo
- `Pomodoro 25/5`
- `Focus 50/10`

Así el nombre sigue existiendo, pero el usuario no tiene que inventarlo manualmente siempre.

---

### ¿Hace falta indexar `PomodoroPlan` por `taskId` o por tarea?

#### Respuesta corta
`taskId @unique` ya crea una restricción fuerte y también ayuda al acceso por tarea.

#### Además
Ya existe:
```prisma
@@index([routineId])
```

#### Qué significa
- obtener el plan de una tarea concreta ya está bien resuelto por la unicidad de `taskId`
- análisis futuros por rutina también tienen soporte básico

#### Para gráficas más complejas
Probablemente el verdadero problema no será un índice extra aquí, sino que después necesites una entidad de historial o sesiones.

---

### ¿Las notas deberían poder consultarse por usuario directamente?

#### Respuesta corta
Sí, como caso de uso futuro tiene sentido.

#### Pero ojo
Ahora mismo la nota pertenece a `Task`, y `Task` pertenece a `User`.

#### Eso permite
obtener notas de un usuario por relación indirecta.

#### Si el caso de uso se vuelve importante
Entonces sí podrías considerar:
- agregar `userId` directo a `Note`
- o mantener la relación derivada a través de `Task`

#### Recomendación actual
Para este MVP, mantener `Note -> Task -> User` es suficiente.

Si más adelante quieres una vista tipo:
- "todas mis notas"
- "convertir una nota en task"

entonces se reevalúa si conviene denormalizar con `userId` directo en `Note`.

---

## Idea clave del bloque
Prisma aquí no se montó solo para evitar escribir SQL. Se usó para expresar reglas del dominio de forma tipada, consistente y mantenible.

---

## Bloque 4: `src/lib/prisma.ts`, adapters, env y acceso real a la base

### Archivos principales
- `src/lib/prisma.ts`
- `.env`
- `prisma.config.ts`
- `prisma/seed.ts`

---

### `src/lib/prisma.ts`

#### Archivo
- `src/lib/prisma.ts`

#### Para qué sirve
Centraliza la creación del cliente de Prisma que usa la aplicación.

#### Problema que resuelve
Sin este archivo, diferentes partes de la app podrían crear su propia instancia de Prisma y repetir la configuración de conexión.

#### Idea clave
Queremos una sola puerta de acceso a la base de datos desde la aplicación.

---

### ¿Por qué no crear `new PrismaClient()` en cualquier archivo?

#### Respuesta corta
Porque eso dispersa la infraestructura.

#### Problemas de hacerlo mal
- repites configuración
- acoplas módulos a detalles de conexión
- dificultas mantenimiento
- si cambia la forma de inicializar Prisma, debes corregir muchos archivos

#### Mejor enfoque
Crear una sola instancia compartida y reutilizarla.

---

### ¿Por qué usamos `DATABASE_URL`?

#### Archivo relacionado
- `.env`

#### Para qué sirve
Es la cadena de conexión a PostgreSQL.

#### Por qué viene del entorno
Porque la conexión no debe quedar escrita en el código fuente.

#### Beneficios
- seguridad
- portabilidad
- separación entre código y configuración

---

### ¿Por qué Prisma 7 está montado con adapter?

#### Archivos relacionados
- `src/lib/prisma.ts`
- `package.json`

#### Dependencia importante
- `@prisma/adapter-pg`

#### Qué cambió
En este proyecto, el cliente generado de Prisma 7 no estaba funcionando con una inicialización implícita simple.

El cliente esperaba una configuración explícita mediante adapter.

#### Qué significa eso conceptualmente
Prisma necesita saber con qué driver real de base de datos trabajará.

En este caso:
- usamos PostgreSQL
- por eso usamos `PrismaPg`

#### Ejemplo conceptual
```ts
new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});
```

#### Idea clave
No fue una decisión estética.
Fue una necesidad técnica del cliente generado actual de Prisma 7 en este entorno.

---

### `globalThis.prisma`

#### Archivo
- `src/lib/prisma.ts`

#### Para qué sirve
Permite reutilizar la misma instancia del cliente en desarrollo.

#### Por qué importa
Durante desarrollo, el entorno puede recargar módulos varias veces.
Si cada recarga crea un cliente nuevo, puedes terminar con múltiples conexiones innecesarias.

#### Idea clave
No se hace por moda.
Se hace para controlar mejor la instancia compartida en desarrollo.

---

### ¿Por qué `prisma/seed.ts` también usa adapter?

#### Archivo
- `prisma/seed.ts`

#### Respuesta
Porque el seed también es código real que necesita conectarse a la base.

No basta con que la aplicación principal entienda cómo crear el cliente.
El seed también debe respetar esa misma forma de conexión.

#### Idea clave
El seed no es mágico.
También necesita infraestructura correcta para hablar con PostgreSQL.

---

### Diferencia entre `unique` e `index`

#### `@unique` o `@@unique`
Sirve para imponer unicidad.

Eso significa:
- no se pueden repetir esos valores en la base

#### Ejemplos
```prisma
email String @unique
```
Significa:
- no puede haber dos usuarios con el mismo email

```prisma
taskId String @unique
```
Significa:
- no puede haber dos `PomodoroPlan` para la misma tarea

```prisma
@@unique([name, userId])
```
Significa:
- un mismo usuario no puede tener dos rutinas con el mismo nombre

#### Idea clave
`unique` protege una regla de negocio o integridad.

---

#### `@index` o `@@index`
Sirve para mejorar acceso y búsqueda de datos en consultas frecuentes.

No impone unicidad.
Solo organiza mejor cómo la base encuentra filas.

#### Ejemplo
```prisma
@@index([userId, status])
```

Esto ayuda en consultas como:
- tareas de un usuario
- tareas de un usuario filtradas por estado

#### Idea clave
`index` optimiza acceso.
No define una regla de unicidad.

---

### ¿Qué quise decir con índice “normal”?

Cuando dije índice “normal”, me refería a un índice común de base de datos, no a una estrategia especial de búsqueda avanzada.

#### Índice normal
Ayuda mucho en cosas como:
- igualdad exacta
- filtros por columnas concretas
- ordenamiento razonable según el caso
- algunas búsquedas por prefijo

#### Lo que no resuelve tan bien por sí solo
- búsquedas de texto libre complejas
- búsquedas tipo “contiene fragmentos arbitrarios” a gran escala
- ranking semántico

#### Ejemplo
Buscar:
- tareas de un usuario con estado `TODO`

Eso sí encaja muy bien con un índice normal.

Buscar:
- una palabra parecida o contenida en cualquier parte del `description`

Eso ya puede requerir otra estrategia, por ejemplo full-text search en PostgreSQL.

---

### ¿Cuándo usar `index` y cuándo no?

#### Usarlo cuando
- una columna se usa mucho para filtrar
- una relación se consulta con frecuencia
- hay consultas repetidas y previsibles
- necesitas mejorar acceso en campos clave de búsqueda o join

#### No usarlo automáticamente cuando
- el campo casi no se consulta
- no tienes aún un caso de uso real
- quieres "por si acaso" optimizar todo
- se trata de texto libre que quizá necesite otra estrategia

#### Regla práctica
Primero piensa en el patrón de consulta.
Después decides si el índice tiene sentido.

No al revés.

---

### Resumen mental del bloque

- `src/lib/prisma.ts` centraliza el acceso real a la base
- Prisma 7 aquí necesita adapter explícito para PostgreSQL
- `unique` protege integridad o reglas del dominio
- `index` mejora acceso a consultas frecuentes
- un índice “normal” no es lo mismo que una solución de búsqueda avanzada

---

## Bloque 5: Redux base, `app/providers.tsx` y estado compartido del cliente

### Archivos principales
- `app/providers.tsx`
- `src/store/index.ts`
- `src/store/hooks.ts`
- `src/store/slices/app-slice.ts`

---

### ¿Por qué hay Redux si todavía no hay features completas?

#### Respuesta corta
Porque forma parte del stack objetivo del proyecto, pero solo se dejó la base mínima.

#### Idea clave
No se metió Redux para guardar todo.
Se montó para dejar lista la infraestructura de estado compartido del cliente.

---

### `app/providers.tsx`

#### Archivo
- `app/providers.tsx`

#### Para qué sirve
Conecta React con el store de Redux a nivel de la aplicación.

#### Qué hace
Envuelve a la app con el `Provider` de `react-redux`.

#### Ejemplo conceptual
```tsx
<Provider store={store}>{children}</Provider>
```

#### Idea clave
Sin este archivo, los componentes cliente no podrían acceder al store de Redux.

---

### ¿Por qué `app/providers.tsx` tiene `"use client"`?

#### Respuesta
Porque Redux Provider vive del lado cliente.

React Server Components no pueden usar esa parte interactiva del estado como si fuera un componente de servidor puro.

#### Idea clave
Si un archivo usa herramientas o patrones que requieren ejecución del lado cliente, debe declararse como Client Component.

---

### `src/store/index.ts`

#### Archivo
- `src/store/index.ts`

#### Para qué sirve
Define el store principal de Redux.

#### Qué hace
- registra reducers
- habilita Redux DevTools en desarrollo
- exporta tipos globales del store

#### Ejemplo conceptual
```ts
configureStore({
  reducer: {
    app: appReducer,
  },
});
```

#### Idea clave
Este archivo define la raíz del estado global del cliente.

---

### `RootState` y `AppDispatch`

#### Archivo
- `src/store/index.ts`

#### Para qué sirven
Son tipos derivados del store real.

#### Beneficio
Evitan inventar tipos manualmente y mantienen coherencia con la configuración real de Redux.

#### Idea clave
Los tipos salen del store real, no de una definición paralela escrita a mano.

---

### `src/store/hooks.ts`

#### Archivo
- `src/store/hooks.ts`

#### Para qué sirve
Define hooks tipados para usar Redux sin repetir tipos en cada componente.

#### Qué exporta
- `useAppDispatch`
- `useAppSelector`

#### Por qué importa
Evita esto en todos lados:
- importar tipos manualmente
- tipar selector por selector
- tipar dispatch cada vez

#### Idea clave
Centralizar hooks tipados reduce fricción y errores de tipos en componentes cliente.

---

### `src/store/slices/app-slice.ts`

#### Archivo
- `src/store/slices/app-slice.ts`

#### Para qué sirve
Define un slice mínimo de estado global del cliente.

#### Estado actual
- `notificationsEnabled`
- `activeTimerTaskId`

#### Por qué se eligieron esos campos
Porque son ejemplos razonables de estado cliente compartido que sí puede terminar viviendo en Redux:
- permisos o estado de notificaciones
- tarea activa del timer

#### Qué no se hizo
No se metieron todavía:
- listas completas de tareas
- todo el estado de la app
- datos de servidor sin criterio

#### Idea clave
Redux se dejó preparado, pero no inflado artificialmente.

---

### ¿Por qué no guardar todo en Redux desde el inicio?

#### Respuesta corta
Porque sería mala arquitectura.

#### Problema
Redux no debe ser un basurero de estado.

#### Buenos candidatos para Redux
- estado cliente duradero
- estado compartido entre pantallas
- estado interactivo del timer
- preferencias o permisos del cliente

#### Malos candidatos para Redux por defecto
- cualquier dato del servidor solo por costumbre
- formularios locales simples
- datos que pertenecen naturalmente al render del servidor

#### Idea clave
Primero se decide quién es dueño del estado. Después se decide si Redux lo merece.

---

### ¿Por qué este bloque importa para aprender?

Porque enseña una diferencia muy importante:

- infraestructura preparada
no es lo mismo que
- complejidad innecesaria

Aquí se dejó una base lista para crecer, sin llenar Redux de cosas prematuras.

---

### Resumen mental del bloque

- `app/providers.tsx` conecta React con Redux en el cliente
- `src/store/index.ts` crea la raíz del estado global
- `src/store/hooks.ts` evita repetir tipos de Redux en cada componente
- `app-slice.ts` deja un estado mínimo y razonable
- Redux no debe usarse para guardar todo, solo el estado que realmente lo necesita

---

### Ajustes finos sobre el bloque 5

#### Sobre `"use client"`
No es solo porque exista server-side rendering.

La razón más precisa es:
- `Provider` de Redux usa contexto y estado del lado cliente
- eso necesita ejecutarse como Client Component

#### Sobre qué estado sí merece Redux
Buena regla práctica:
- estado compartido
- estado interactivo
- estado del navegador
- estado cliente duradero

#### Sobre qué estado no merece Redux por defecto
- datos que vienen de una query y pueden resolverse mejor desde el servidor
- estado local de formularios simples
- información temporal que solo vive en un componente

#### Matiz importante sobre notas borrador
Antes de guardar una nota, muchas veces ese estado puede vivir localmente en el componente.

Solo tendría sentido llevarlo a Redux si:
- varias pantallas lo comparten
- debe sobrevivir navegación compleja
- o participa en un flujo más global

---

## Preguntas de tensión sobre entidades

Estas preguntas no significan que el diseño actual esté mal.
Sirven para comprobar si el modelo aguanta crecimiento.

### `User`
- ¿Necesitará más adelante campos como displayName, avatar o timezone?
- Si sí, ¿siguen perteneciendo a `User` o convendría una separación futura entre identidad y perfil?

### `Task`
- ¿El estado actual de la tarea alcanza con `TODO`, `IN_PROGRESS`, `DONE`, `ARCHIVED`?
- ¿Habrá fechas límite, orden manual o categorías en una siguiente fase?
- ¿La prioridad será solo visual o también afectará lógica de negocio?

### `PomodoroRoutine`
- ¿Basta con una rutina reusable por nombre y tiempos, o más adelante habrá presets favoritos, colores o etiquetas?
- ¿El usuario podrá clonar una rutina global para personalizarla?

### `PomodoroPlan`
- ¿El progreso acumulado es suficiente para MVP o ya se siente la ausencia de historial real?
- Si un usuario cambia la rutina de una tarea, ¿se sobrescribe el plan o se crea otro registro histórico?

### `Note`
- ¿Seguirán siendo notas estrictamente ligadas a tareas?
- ¿En una fase futura habrá notas libres del usuario que luego puedan convertirse en tarea?
- Si aparece la vista “todas mis notas”, ¿conviene mantener la relación derivada vía `Task` o agregar `userId` directo?

### Futuro posible: sesiones
- Si mañana quieres gráficas reales, ¿aparecería una entidad tipo `PomodoroSession` o `FocusSession`?
- Esa entidad probablemente sería más importante para analytics que seguir cargando responsabilidades en `PomodoroPlan`

---

## Respuestas trabajadas sobre entidades

### `User`

#### Criterio actual
El modelo actual de `User` puede ampliarse después sin problema.

#### Dirección elegida
- mantenerlo mínimo ahora
- agregar campos como `displayName`, `avatar` o `timezone` como una futura actualización o feature

#### Idea clave
No hace falta inflar `User` desde el principio si esos campos todavía no participan en una funcionalidad real.

---

### `Task`

#### `dueDate`
No se considera necesario para el enfoque actual del producto.

#### Razón
La app no está pensada como un sistema estilo Scrum.
Está más orientada a aprendizaje, enfoque personal, organización y manejo del tiempo.

#### `category`
Se reconoce como posible feature futura, sobre todo si más adelante se quiere:
- agrupar trabajo
- generar analítica
- medir tiempo invertido por habilidad o tema

#### `estimatedPomodoros`
No se considera necesario como campo separado ahora.

#### Razón
La estimación ya está representada por la propia configuración del plan:
- si el usuario define cuántos pomodoros necesita
- eso ya expresa el estimado operativo

---

### `PomodoroRoutine`

#### Rutinas globales
No deben poder editarse directamente.

#### Mejor experiencia
- permitir clonar una rutina global
- luego convertir esa copia en una rutina propia del usuario

#### Matiz importante
Aunque desde frontend se puede resolver la experiencia, la regla de negocio también debe existir en backend:
- una rutina global no debe poder mutarse como si fuera una rutina privada del usuario

#### Idea clave
El frontend puede facilitar el flujo de clonación, pero el backend debe proteger la invariantes del dominio.

---

### `PomodoroPlan`

#### Cambio de estimación o rutina
La decisión actual es ser flexible en MVP.

#### Dirección elegida
- permitir actualizar el plan existente
- no forzar historial de cambios todavía

#### Razón
La app busca ayudar a aprender a administrar el tiempo.
En ese contexto, el usuario puede equivocarse en la planeación y corregirla sin mucha fricción.

#### Idea clave
Para MVP se acepta sobrescribir el plan.
Si después hay analítica fuerte o auditoría, entonces sí podría aparecer historial.

---

### `Note`

#### Conversión de nota a tarea
La lectura actual es que esto puede resolverse como flujo de frontend.

#### Enfoque elegido
- la nota sigue perteneciendo a una tarea o a su contexto actual
- al convertirla en tarea, se puede abrir un formulario prellenado usando el contenido de la nota como base

#### Idea interesante detectada
Esto abre una posible conversación futura sobre:
- épicas
- subtareas
- relaciones entre trabajo grande y trabajo derivado

---

### `Task` y subtareas

#### Riesgo detectado
Subtareas o tareas hijas agregan complejidad relacional muy rápido.

#### Decisión intuitiva actual
No meter subtareas todavía.

#### Razón
- complica ids y relaciones
- aumenta la complejidad del dominio pronto
- puede volver más confusa una app que hoy busca claridad y foco

#### Idea clave
Es una feature con bastante peso estructural, no un pequeño detalle de UI.

---

### Aclaración extra: analogía con "provider" y uso de `globalThis`

#### Idea útil
Pensarlo como una especie de provider o punto central de acceso es una buena intuición.

#### Matiz importante
No es exactamente un React Provider.

Más bien es:
- una instancia compartida de infraestructura
- disponible para que otros módulos la importen
- sin volver a crear el cliente muchas veces

#### Sobre `globalThis`
`globalThis` no significa “el global de ese archivo”.

Significa:
- el objeto global estándar del entorno de JavaScript actual

Dependiendo del entorno, históricamente existían nombres distintos como:
- `window` en navegador
- `global` en Node.js

`globalThis` existe para tener una forma unificada de referirse al objeto global.

#### En este proyecto
Se usa para guardar una instancia compartida de Prisma durante desarrollo y así evitar recrearla innecesariamente cuando el entorno recarga módulos.

#### Idea clave
- `declare global` ayuda a TypeScript a entender que esa propiedad global existe
- `globalThis.prisma` es la forma real de leer o escribir esa propiedad en tiempo de ejecución
