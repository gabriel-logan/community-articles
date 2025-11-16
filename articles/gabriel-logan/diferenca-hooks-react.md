# React — Hooks, Ciclo de Vida e Redirecionamento (React / React Native)

Esta documentação detalha as diferenças entre os hooks `useEffect`, `useLayoutEffect`, `useCallback` e `useMemo` no React, com foco especial em como eles se comportam tanto no React Web quanto no React Native. Também aborda o uso do hook `useFocusEffect` do React Navigation para navegação em aplicativos móveis.

---

# 1. Ciclo de Renderização: `useEffect` vs `useLayoutEffect`

## 1.1 `useEffect`

- Executa **após a renderização completa da tela**.
- O navegador (ou o RN UI Manager) **já pintou** a interface quando esse hook roda.
- Ideal para:
  - Fetch de APIs
  - Listeners (eventos globais)
  - Timers
  - Qualquer efeito que **não precise bloquear a renderização**

### Característica importante

Alterações no layout feitas dentro do `useEffect` podem causar **flash de UI**, já que o usuário vê a tela antes das mudanças.

## 1.2 `useLayoutEffect`

- Executa **logo após a renderização**, mas **antes da pintura da tela**.
- Bloqueia a pintura até terminar.
- Ideal para:
  - Medir layout
  - Ajustar posições
  - Calcular dimensões
  - Evitar que UI incorreta apareça antes de ajustes
  - Redirecionar o usuário antes que ele veja uma tela errada

### Analogia simples

- `useEffect` → como script colocado no **final do body**.
- `useLayoutEffect` → como script colocado no **head**, rodando antes da exibição.

## 1.3 Uso prático para redirecionamento (Web)

```tsx
useLayoutEffect(() => {
  if (token) navigate("/dashboard");
}, [token]);
```

👉 Garante que o usuário **não veja** a tela de login caso esteja autenticado.

---

# 2. `useCallback` vs `useMemo`

## 2.1 `useCallback`

- Memoriza **funções**.
- Evita recriar a mesma função em cada render.
- Usado para otimizações com componentes `React.memo`.

```tsx
const handleClick = useCallback(() => {
  console.log("clicou");
}, []);
```

## 2.2 `useMemo`

- Memoriza **resultados de cálculos**.
- Evita reprocessamento desnecessário.

```tsx
const total = useMemo(() => items.reduce((a, b) => a + b, 0), [items]);
```

## Resumo

| Hook          | Memoriza | Uso típico                |
| ------------- | -------- | ------------------------- |
| `useCallback` | Funções  | Evitar rerenders em props |
| `useMemo`     | Valores  | Cálculos pesados          |

---

# 3. React Native: Efeitos e Navegação

## 3.1 `useEffect` no RN

- Funciona igual ao React Web.
- **Não garante execução toda vez que a tela ganha foco**, porque o componente pode não ser desmontado ao navegar.

## 3.2 `useLayoutEffect` no RN

- Também funciona exatamente como no Web.
- Executa antes da tela ser apresentada.
- Excelente para:
  - Redirecionamento imediato
  - Ajuste visual antes de mostrar a interface

## 3.3 `useFocusEffect` (React Navigation)

Esse hook é exclusivo do React Native Navigation.

Ele executa sempre que a tela:

- Ganha foco
- Volta do background
- Reentra após navegação

### Exemplo

```tsx
useFocusEffect(
  useCallback(() => {
    if (token) navigation.replace("Home");
  }, [token]),
);
```

### Quando usar:

- Quando você precisa executar a lógica **toda vez que o usuário volta para a tela**, mesmo que o componente não seja remontado.

## 3.4 Quando usar cada um no RN

| Situação                                       | Hook recomendado                      |
| ---------------------------------------------- | ------------------------------------- |
| Rodar código somente no primeiro render        | `useEffect`                           |
| Medir ou ajustar layout antes da tela aparecer | `useLayoutEffect`                     |
| Executar lógica sempre que a tela for mostrada | `useFocusEffect`                      |
| Redirecionar antes da tela aparecer            | `useLayoutEffect` ou `useFocusEffect` |

---

# 4. Redirecionamento baseando-se no login (token Zustand)

## 4.1 Web (React Router)

```tsx
useLayoutEffect(() => {
  if (token) navigate("/dashboard");
}, [token]);
```

👉 Evita flash da tela de login.

## 4.2 React Native

### Opção A — Redirecionar no primeiro render

```tsx
useLayoutEffect(() => {
  if (token) navigation.replace("Dashboard");
}, [token]);
```

### Opção B — Redirecionar toda vez que a tela volta

```tsx
useFocusEffect(
  useCallback(() => {
    if (token) navigation.replace("Dashboard");
  }, [token]),
);
```

---

# 5. Quando **não** usar `useLayoutEffect`

- Para fetchs
- Para listeners globais
- Para operações assíncronas comuns
- Para qualquer coisa que **não depende de bloquear a UI**

Ele pode causar:

- Bloqueio desnecessário da renderização
- Perda de performance

👉 **Regra de ouro:** use `useLayoutEffect` apenas quando “a tela não pode aparecer até X acontecer”.

---

# 6. Resumo Geral

## `useEffect`

- Depois da renderização
- Não bloqueia UI

## `useLayoutEffect`

- Antes da tela pintar
- Bloqueia UI até terminar
- Ideal para redirecionamento imediato

## `useCallback`

- Memoriza funções
- Otimização

## `useMemo`

- Memoriza valores
- Evita cálculos pesados

## `useFocusEffect` (RN)

- Executa quando a tela ganha foco
- Ideal para redirecionamentos e revalidar dados

---

# 7. Melhor escolha para cada caso

| Caso                                           | Web               | React Native      |
| ---------------------------------------------- | ----------------- | ----------------- |
| Verificar token e redirecionar no carregamento | `useLayoutEffect` | `useLayoutEffect` |
| Redirecionar sempre que a tela volta           | —                 | `useFocusEffect`  |
| Evitar flash antes do redirecionamento         | `useLayoutEffect` | `useLayoutEffect` |
| Buscar dados comuns                            | `useEffect`       | `useEffect`       |
| Medir layout                                   | `useLayoutEffect` | `useLayoutEffect` |
| Otimizações de função                          | `useCallback`     | `useCallback`     |
| Otimizações de cálculo                         | `useMemo`         | `useMemo`         |
