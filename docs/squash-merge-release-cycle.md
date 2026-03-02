# Squash Merge & Release Cycle

Workflow basado en sprints con squash merges a main. Usa 3 branches: **main**, **stg** y **dev**.

---

## 1. Descripción General

Este workflow está diseñado para desarrollo basado en sprints con ciclos de release limpios usando squash merges. Mantiene un historial limpio y lineal en main mientras acumula el trabajo del sprint en stg.

### Estructura de Branches

| Branch | Propósito | Descripción |
|--------|-----------|-------------|
| `main` | Código en producción | Fuente de verdad. Refleja exactamente lo que está corriendo en el ambiente de producción. |
| `stg` | Staging / Integración | Acumula los features del sprint. QA y stakeholders validan acá. Cumple el rol de rama de integración. |
| `dev` | Desarrollo | Ambiente de desarrollo para testing individual de desarrolladores. |

> **Principio Clave:** `stg` cumple el rol de integración. Después de cada release, `main` se mergea a `stg` y `dev` para mantener todo sincronizado.

---

## 2. Sprint 1 — Desarrollo de Features

### Creación de Feature Branches

Los feature branches se crean desde **main**:

```bash
git checkout main
git pull origin main
git checkout -b feature/nombre-descriptivo
```

### 2 PRs por Feature (merge normal, no squash)

| PR | Dirección | Propósito |
|----|-----------|-----------|
| **PR 1** | `feature/nombre` → `dev` | Testing de desarrolladores |
| **PR 2** | `feature/nombre` → `stg` | Testing QA/stakeholders + integración |

<!-- DIAGRAMA: Sprint 1 — Feature Development Flow
     Mostrar:
     - main (rosa) arriba con commit "Inicio"
     - feature/A (verde) con commits feat A.1, A.2, A.3 saliendo de main
     - feature/B (verde) con commits feat B.1, B.2 saliendo de main
     - dev (azul) abajo recibiendo merge de A y B
     - stg (naranja) abajo recibiendo merge de A y B
     Colores: main=#ff0080, feature=#0dde6a, dev=#0070f3, stg=#fb923c
-->

*Insertar diagrama de flujo del Sprint 1 aquí*

### Estado al Final del Sprint 1

- `stg` tiene todos los commits de los features del sprint
- `main` sin cambios
- Todas las features testeadas y aprobadas en stg

---

## 3. Manejo de Conflictos

> **REGLA CRITICA:** **NUNCA** hacer merge de `dev`, `stg` o `main` hacia el feature branch.

Si hay conflictos al crear los PRs:

1. Crear un nuevo branch específico para resolver conflictos
2. Resolver los conflictos en ese branch
3. Crear un nuevo PR desde el branch de resolución
4. **NO** contaminar el feature branch original

<!-- DIAGRAMA: Conflict Resolution Flow
     Mostrar:
     - feature/A (verde) con commits feat A, feat A.2
     - resolve/A-stg (purple) saliendo de feature/A con commits "resolve", "fix conflict"
     - stg (naranja) recibiendo merge desde resolve/A-stg
     Colores: feature=#0dde6a, resolve=#a855f7, stg=#fb923c
-->

*Insertar diagrama de resolución de conflictos aquí*

---

## 4. Features que no llegan a Release

Si un feature que ya está en `stg` no va a llegar a `main` en el release actual, hay dos estrategias:

### Opción A: Rollback en stg

Revertir los commits del feature en stg antes del squash merge a main.

- Útil cuando el feature tiene problemas de calidad o se decidió postergarlo
- El feature branch original se preserva para retomarlo en un sprint futuro

### Opción B: Feature Flag

El feature se despliega a producción pero deshabilitado mediante un feature flag.

- Útil cuando el código ya está integrado con otros features y un rollback sería complejo
- Permite activarlo gradualmente cuando esté listo sin necesidad de un nuevo deploy

### Criterio de Decisión

| Situación | Estrategia |
|-----------|------------|
| Feature aislado y fácil de revertir | **Rollback** |
| Feature entrelazado con otros cambios o casi listo | **Feature Flag** |

---

## 5. Día de Release

### Paso 1: Squash Merge de stg a main

Todos los commits del sprint se combinan en un único commit limpio en main.

```bash
git checkout main
git merge --squash stg
git commit -m "Release Sprint X: Feature A, Feature B, ..."
git push origin main
```

<!-- DIAGRAMA: Squash Merge stg → main
     Mostrar:
     - stg (naranja) con "10 commits"
     - main (rosa) recibiendo squash merge con commit "Sprint 1" marcado con "S"
     - Flecha de merge desde stg hacia main
     Colores: stg=#fb923c, main=#ff0080
-->

*Insertar diagrama de squash merge aquí*

#### Por qué Squash

| Beneficio | Descripción |
|-----------|-------------|
| Historial limpio | Historial limpio y lineal en main |
| Reversiones fáciles | Fácil revertir sprints completos si es necesario |
| Hitos claros | Hitos de release claros |
| Auditoría | Auditoría simplificada |

### Paso 2: Merge main de vuelta a stg y dev (CRITICO)

> **Este paso es CRITICO.** Después del squash merge, main se debe mergear de vuelta a **ambos** `stg` y `dev`.

```bash
git checkout stg
git merge main
git push origin stg

git checkout dev
git merge main
git push origin dev
```

<!-- DIAGRAMA: Sync Back — main → stg & dev
     Mostrar:
     - main (rosa) con commit "Sprint 1" marcado como squash
     - stg (naranja) recibiendo merge desde main con commit "sync"
     - dev (azul) recibiendo merge desde main con commit "sync"
     Colores: main=#ff0080, stg=#fb923c, dev=#0070f3
-->

*Insertar diagrama de sincronización aquí*

### Resultado

- `main`: 1 commit squasheado
- `stg` y `dev`: sincronizados con main
- **Todo listo para el próximo sprint sin conflictos**

---

## 6. Sprint 2 — Comenzando de Nuevo

Con `stg` y `dev` sincronizados con `main`, el Sprint 2 comienza limpio. Features nuevos salen de main, PRs van a dev y stg.

<!-- DIAGRAMA: Sprint 2 — Clean Start
     Mostrar:
     - main (rosa) con commit "Sincronizado"
     - feature/C (verde) saliendo de main
     - feature/D (verde) saliendo de main
     - stg (naranja) con commit "Sincronizado"
     - dev (azul) con commit "Sincronizado"
     Colores: main=#ff0080, feature=#0dde6a, stg=#fb923c, dev=#0070f3
-->

*Insertar diagrama del Sprint 2 aquí*

> **Sin Conflictos:** Porque mergeamos main de vuelta a stg y dev, todas las nuevas ramas de features comienzan desde un estado limpio sin conflictos de merge o commits duplicados.

---

## 7. Mejores Prácticas

1. Siempre mergear main de vuelta a stg y dev después del release
2. Mantener duraciones de sprint consistentes
3. Testear exhaustivamente en stg antes de liberar
4. Documentar notas de release con cada commit squash
5. Etiquetar releases en main para fácil referencia

---

## Resumen Visual del Ciclo Completo

<!-- DIAGRAMA: Ciclo Completo (Resumen)
     Mostrar el flujo completo:
     1. Features salen de main → van a dev y stg via PRs
     2. stg acumula todo el sprint
     3. Squash merge de stg → main (día de release)
     4. main se sincroniza de vuelta a stg y dev
     5. Nuevo sprint comienza limpio
-->

*Insertar diagrama resumen del ciclo completo aquí*

---

## Quick Reference

```
CICLO DE RELEASE

1. Feature branches salen de main
2. PR1: feature → dev    (testing devs)
3. PR2: feature → stg    (testing QA + integración)
4. Release: squash merge stg → main
5. Sync: merge main → stg & dev
6. Repetir

NUNCA mergear dev/stg/main al feature branch
SIEMPRE sincronizar después del release
```
