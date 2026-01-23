# 3 PR Workflow

## Overview

### ¿Por Qué Este Workflow?

En equipos grandes trabajando en el mismo repositorio, el flujo tradicional (dev → stg → main) puede generar bloqueos:

**Problema tradicional:**

```
dev contiene:
- Feature A (lista, testeada) ✓
- Feature B (con bugs críticos) ✗

Resultado: Feature B bloquea el deploy de Feature A
No puedes hacer dev → stg → main
```

**Solución:**

Cada feature avanza independientemente mediante 3 PRs separados:

```
Feature A: main → feature-A → dev → stg → main (avanza completa)
Feature B: main → feature-B → dev (se queda aquí hasta que esté OK)
Feature C: main → feature-C → dev → stg (esperando QA)
```

### Ventajas

✅ **Sin bloqueos entre features** - Cada una avanza a su ritmo  
✅ **Deploy selectivo** - Solo lo que está listo llega a producción  
✅ **Flexibilidad para equipos** - QA puede aprobar features independientemente  
✅ **Mejor control** - Claridad sobre qué está en cada ambiente

### Trade-offs

⚠️ **Más PRs por feature** - 3 en vez de 1  
⚠️ **Sincronización manual** - Requiere disciplina  
⚠️ **Más complejo** - Curva de aprendizaje

## Flujo Visual

### Descripción del Flujo

1. **Crear Feature** - Desde main (siempre)
2. **3 PRs Automáticos** - Se crean al hacer push
3. **Merge Secuencial** - Cada PR cuando cumple requisitos

```
MAIN (producción)
  ↓ crear feature
FEATURE/* (desarrollo)
  ↓ PR #1
DEV (testing) → cuando CI pasa
  ↓ PR #2
STG (QA) → cuando QA aprueba
  ↓ PR #3
MAIN (producción) → cuando tech leads aprueban
```

## Proceso Detallado

### Paso 1: Crear Feature Branch

```bash
# Siempre desde main
git checkout main
git pull origin main
git checkout -b feature/backend-auth-login-API-123
git push -u origin feature/backend-auth-login-API-123
```

✅ **Automáticamente se crean 3 PRs:**

- `[DEV] backend-auth-login-API-123` → feature → dev
- `[STG] backend-auth-login-API-123` → feature → stg (draft)
- `[PROD] backend-auth-login-API-123` → feature → main (draft)

### Paso 2: Desarrollo

```bash
# Trabajo diario
git add .
git commit -m "feat(auth): add JWT validation"
git push origin feature/backend-auth-login-API-123

# Sincronizar con main (diariamente)
git fetch origin
git rebase origin/main
git push --force-with-lease origin feature/backend-auth-login-API-123
```

⚠️ **Importante**: Sincroniza con main diariamente para evitar conflictos masivos.

### Paso 3: PR #1 - Development

**Cuándo:** Cuando la feature funciona localmente

**Requisitos:**
- ✅ CI/CD pasa (lint + typecheck + build)
- ✅ Tests automáticos OK
- ⚠️ Code review opcional

**Acción:**
- El PR se actualiza automáticamente con cada push
- Verificar que CI pase
- Mergear (sin esperar approval)
- **Método:** MERGE commit

### Paso 4: PR #2 - Staging

**Cuándo:** Después de mergear a dev

**Requisitos:**
- ✅ PR a dev mergeado
- ✅ Testing en dev OK
- ✅ 1 approval requerida
- ✅ QA sign-off

**Acción:**
- Cambiar PR de draft a ready for review
- QA testea en ambiente stg
- Si falla: fix en feature branch, push (PR se actualiza)
- Si pasa: QA aprueba y mergeas
- **Método:** MERGE commit

### Paso 5: PR #3 - Production

**Cuándo:** Después de mergear a stg

**Requisitos:**
- ✅ PR a stg mergeado
- ✅ QA aprobado en stg
- ✅ 2+ approvals (tech leads)
- ✅ Todos los tests pasando

**Acción:**
- Cambiar PR de draft a ready for review
- Solicitar approvals de tech leads
- Verificar que todo está OK
- Mergear → deploy automático a producción
- **Método:** MERGE commit

### Paso 6: Cleanup

```bash
# Automático: el branch se elimina después del merge a main
# Verificar que fue eliminado:
git fetch --prune
git branch -a | grep feature/backend-auth-login
```

## GitHub Actions

### 1. Auto-crear PRs

**Workflow:** `.github/workflows/auto-create-prs.yml`

**Qué hace:**

- Detecta branches con los siguientes prefijos:
  - `feature/` - Nuevas funcionalidades
  - `fix/` - Corrección de bugs
  - `hotfix/` - Fixes críticos urgentes
  - `refactor/` - Refactorización de código
  - `docs/` - Cambios en documentación

- Crea/verifica labels automáticos
- Crea 3 PRs automáticamente:
  - `[DEV]` → branch → dev (ready for review)
  - `[STG]` → branch → stg (draft)
  - `[PROD]` → branch → main (draft)

**Convención de Nomenclatura:**

```bash
# Formato recomendado:
<tipo>/<JIRA-TICKET>-descripcion-corta

# Ejemplos correctos:
feature/ACA-123-login-authentication
fix/ACA-456-header-responsive
hotfix/ACA-789-payment-critical-bug
refactor/ACA-234-auth-service
docs/ACA-567-api-documentation

# ❌ Ejemplos incorrectos (sin ticket):
feature/login
fix/bug-header
```

**¿Por qué incluir el ticket de JIRA?**

✅ Trazabilidad automática entre código y tareas  
✅ Fácil identificar qué PRs pertenecen a qué historia  
✅ Reporting y métricas más precisas  
✅ Code review más contextual

### 2. CI/CD - Validación Automática

**Workflow:** `.github/workflows/ci.yml`

**Ejecuta:**
- Build del proyecto
- Lint y typecheck
- Tests automáticos

**Si algo falla:**
- ❌ PR queda bloqueado
- ⚠️ No se puede mergear hasta corregir
- 🔴 Status check muestra error en rojo

**Si todo pasa:**
- ✅ PR puede mergearse
- 🟢 Status check muestra success en verde

## Reglas Importantes

### ✅ QUÉ HACER

**1. Crear features desde main**

```bash
git checkout main  # ✅
git checkout -b feature/nombre
```

**2. Sincronizar con main diariamente**

```bash
git fetch origin
git rebase origin/main
git push --force-with-lease
```

**3. Usar MERGE en todos los PRs**
- Preserva historial
- Git sabe que es el mismo código

**4. Resolver conflictos en tu branch**

```bash
# Durante rebase
git status
# Editar archivos
git add .
git rebase --continue
```

**5. Mantener PRs actualizados**
- Push frecuente
- CI corre en cada push

### ❌ QUÉ NO HACER

**1. NO crear features desde dev o stg**

```bash
git checkout dev   # ❌ NUNCA
git checkout -b feature/nombre
```

**Por qué:** Feature estará basada en código que puede no llegar a main

**2. NO usar SQUASH en los PRs**

```bash
# GitHub PR: "Squash and merge"  ❌ NUNCA
```

**Por qué:** Crea commits diferentes en cada branch, rompe la sincronización

**3. NO mergear manualmente entre dev/stg/main**

```bash
git checkout dev
git merge stg  # ❌ NUNCA
```

**Por qué:** Rompe el flujo de PRs independientes

**4. NO hacer force push sin --force-with-lease**

```bash
git push -f origin feature/nombre  # ❌ PELIGROSO
git push --force-with-lease        # ✅ SEGURO
```

**Por qué:** `--force-with-lease` verifica que no sobrescribas trabajo de otros

**5. NO commitear directamente a main/stg/dev**

```bash
git checkout main
git commit -m "fix"  # ❌ PROHIBIDO
```

**Por qué:** Estas branches están protegidas, siempre vía PR

## Troubleshooting

### Problema: PRs no se crearon automáticamente

**Síntomas:**
- Hice push de `feature/*` pero no veo los 3 PRs

**Soluciones:**

1. Verificar permisos:
```
Settings → Actions → General → Workflow permissions
☑ Allow GitHub Actions to create and approve pull requests
```

2. Ver logs:
```
Actions → Auto-crear PRs → Ver último run
```

3. Crear manualmente:
```bash
gh pr create --base dev --head feature/nombre --title "[DEV] nombre"
gh pr create --base stg --head feature/nombre --title "[STG] nombre" --draft
gh pr create --base main --head feature/nombre --title "[PROD] nombre" --draft
```

### Problema: CI falla en "Generate Prisma Client"

**Síntomas:**
```
Error: Missing required environment variable: DATABASE_URL
```

**Solución:**

Verificar que el workflow tiene:

```yaml
- name: Generate Prisma Client
  run: pnpm db:generate
  env:
    DATABASE_URL: "postgresql://fake:fake@localhost:5432/fake"
```

### Problema: Branches divergieron

**Síntomas:**
- main tiene: Feature A
- stg tiene: Feature A + Feature B
- dev tiene: Feature A + Feature B + Feature C

**Solución:**

Sincronización manual (semanal):

```bash
# main → stg
git checkout stg
git pull origin stg
git merge origin/main
git push origin stg

# main → dev
git checkout dev
git pull origin dev
git merge origin/main
git push origin dev
```

## FAQ

### ¿Por qué crear desde main y no desde dev?

**Respuesta:**

Porque cada feature debe ser independiente. Si creas desde dev:
- Tu feature incluye código de otras features que pueden no llegar a main
- Si esas features se cancelan, la tuya tiene código "basura"
- Conflictos más complejos

Crear desde main garantiza que solo tienes código estable de producción.

### ¿Qué pasa si una feature nunca llega a main?

**Respuesta:**

Se queda en dev o stg indefinidamente. Opciones:

A) Dejarla ahí (si puede servir después)  
B) Revertirla (si bloquea algo)  
C) Archivar el branch (para referencia)

```bash
# Revertir en dev
git checkout dev
git revert <commit-hash>
git push origin dev
```

### ¿Cómo hago un hotfix urgente?

**Respuesta:**

Hotfix sigue el mismo flujo pero acelerado:

```bash
# 1. Crear desde main
git checkout main
git checkout -b hotfix/critical-bug-999

# 2. Fix
git commit -m "fix: critical production bug"
git push -u origin hotfix/critical-bug-999

# 3. PRs se crean automáticamente
# 4. Fast-track approvals
# - Mergear a dev inmediatamente
# - Mergear a stg con 1 approval rápida
# - Mergear a main con 2 approvals urgentes

# Total: ~1-2 horas en vez de días
```

### ¿Puedo tener múltiples features en progreso?

**Respuesta:**

Sí, sin problema. Cada feature es independiente:

```bash
git checkout main

# Feature 1
git checkout -b feature/login
# ... trabajo ...
git push -u origin feature/login

# Feature 2
git checkout main
git checkout -b feature/dashboard
# ... trabajo ...
git push -u origin feature/dashboard
```

Cada una tendrá sus propios 3 PRs.

### ¿Por qué MERGE y no SQUASH?

**Respuesta:**

**MERGE:**
- Preserva historial completo
- Git sabe que es el mismo código en dev/stg/main
- Fácil sincronizar después

**SQUASH:**
- Crea commits diferentes en cada branch
- Git piensa que son cambios distintos
- Rompe la sincronización

**Ejemplo:**

```bash
# Con MERGE
feature → dev (commits A, B, C)
feature → stg (commits A, B, C) ← mismo historial
feature → main (commits A, B, C) ← mismo historial

# Con SQUASH (MAL)
feature → dev (commit X = A+B+C combinados)
feature → stg (commit Y = A+B+C combinados)
feature → main (commit Z = A+B+C combinados)
# X, Y, Z son commits DIFERENTES
# Git no sabe que son lo mismo
```

## Checklist para Nuevos Devs

### Primera Vez

**Verificar configuración:**
- ☐ `pnpm -v` (verificar versión)
- ☐ `node -v` (verificar versión)
- ☐ `pnpm install` (instalar dependencies)
- ☐ `pnpm run lint` (verificar que funciona)
- ☐ `pnpm run typecheck` (verificar que funciona)
- ☐ `pnpm run build` (verificar que funciona)

### Por Cada Feature

**Inicio:**
- ☐ `git checkout main && git pull origin main`
- ☐ `git checkout -b feature/[equipo]-[nombre]-[TICKET]`
- ☐ `git push -u origin feature/[nombre]`
- ☐ Verificar que se crearon 3 PRs en GitHub

**Durante desarrollo:**
- ☐ Commits frecuentes (feat/fix/docs/refactor)
- ☐ Push diario
- ☐ Sync con main cada mañana
- ☐ Verificar que CI pase

**PR a dev:**
- ☐ CI pasa (lint + typecheck + build)
- ☐ Tests OK
- ☐ Mergear sin esperar approval

**PR a stg:**
- ☐ Cambiar de draft a ready
- ☐ Solicitar QA testing
- ☐ Esperar 1 approval + QA sign-off
- ☐ Mergear

**PR a main:**
- ☐ Cambiar de draft a ready
- ☐ Solicitar 2+ approvals tech leads
- ☐ Todos los tests pasando
- ☐ Mergear
- ☐ Verificar deploy a producción

**Cleanup:**
- ☐ Verificar que branch fue eliminado
- ☐ `git fetch --prune`
