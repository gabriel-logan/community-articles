# EN

# Beginner-Friendly Guide — `*` and `&` in Go

> This version is intentionally more didactic. The goal is not just to define `&` and `*`, but to help you "see" what is happening when variables, addresses, and pointers interact.

---

## Quick Mental Model

Think like this:

- A normal variable stores a value.
- A pointer stores the address of another variable.
- `&x` means: "give me the address of `x`".
- `*p` means: "go to the address inside `p` and read or change the value there".

If you remember only one sentence, remember this:

> `&` gets the address. `*` follows the address.

---

## 1. The Simplest Example

```go
package main

import "fmt"

func main() {
    x := 10
    p := &x

    fmt.Println(x)  // 10
    fmt.Println(p)  // address of x
    fmt.Println(*p) // 10

    *p = 99
    fmt.Println(x) // 99
}
```

What happened:

- `x` stores `10`
- `p` stores the address of `x`
- `*p` reads the value that lives at that address
- `*p = 99` changes the original `x`

---

## 2. How to Read the Types

```go
var x int
var p *int
```

- `x` is an `int`
- `p` is a "pointer to int"

So:

- `x` stores a value like `10`
- `p` stores something like "the place where that `int` lives"

---

## 3. `&` and `*` Without Mystery

### `&` means "address of"

```go
x := 42
p := &x
```

Here:

- `x` is `42`
- `&x` is "the address of `x`"
- `p` receives that address

### `*` means "value at this address"

```go
fmt.Println(*p)
```

This means:

- "take the address stored in `p`"
- "go there"
- "show me the value"

---

## 4. Two Pointers Pointing to the Same Thing

This is one of the most important edge cases to understand.

```go
package main

import "fmt"

func main() {
    something := 123

    a1 := &something
    a2 := &something

    fmt.Println(*a1) // 123
    fmt.Println(*a2) // 123

    *a1 = 500

    fmt.Println(something) // 500
    fmt.Println(*a1)       // 500
    fmt.Println(*a2)       // 500
}
```

Why?

- `a1` and `a2` point to the same variable
- there is only one real value being changed
- changing through one pointer is visible through the other

This answers the case:

- `a1` pointing to `&something`
- `a2` also pointing to the same `&something`

If both point to the same variable, they both observe the same data.

---

## 5. Two Pointers Created with `&User{}`

```go
package main

import "fmt"

type User struct {
    Name string
    Age  int
}

func main() {
    a1 := &User{
        Name: "Ana",
        Age:  20,
    }
    a2 := &User{
        Name: "Bruno",
        Age:  30,
    }

    a1.Age = 21
    a2.Name = "Bruno Lima"

    fmt.Println(*a1) // {Ana 21}
    fmt.Println(*a2) // {Bruno Lima 30}
}
```

Important:

- `a1 := &User{...}` creates one struct and points to it
- `a2 := &User{...}` creates another struct and points to that other one
- even though both are `*User`, they point to different objects
- changing `a1` does not change `a2`

This is different from the previous section:

- before, both pointers pointed to the same thing
- here, each pointer has its own struct

---

## 6. Two Pointers to the Same Struct Already Created

```go
package main

import "fmt"

type User struct {
    Name string
    Age  int
}

func main() {
    something := User{
        Name: "Ana",
        Age:  20,
    }

    a1 := &something
    a2 := &something

    a1.Age = 21
    a2.Name = "Ana Clara"

    fmt.Println(something) // {Ana Clara 21}
    fmt.Println(*a1)       // {Ana Clara 21}
    fmt.Println(*a2)       // {Ana Clara 21}
}
```

Here the idea is:

- the struct already exists in `something`
- `a1` and `a2` both point to that same existing struct
- the two pointers share the same data

---

## 7. Struct Value vs Pointer to Struct

These two are different:

```go
u := User{Name: "Ana", Age: 20} // struct value
p := &u                         // pointer to struct
```

- `u` is the struct itself
- `p` is the pointer to that struct

You can access fields with:

```go
u.Name
p.Name
```

Why does `p.Name` work?

Because Go automatically understands this as:

```go
(*p).Name
```

This is automatic dereferencing for struct field access.

---

## 8. Pointer to a Struct Literal

You do not need to create the struct in a separate line first.

```go
p := &User{
    Name: "Bruno",
    Age:  30,
}
```

This is very common and idiomatic in Go.

Meaning:

- create a `User`
- immediately take its address
- store that address in `p`

### Strange but valid case: a named pointer type

You can also define a type whose underlying type is a pointer:

```go
type UserPtr *User
```

And then use it:

```go
var p UserPtr = &User{
    Name: "Ana",
    Age:  20,
}

fmt.Println((*p).Age)
fmt.Println(p.Name)
```

This is valid Go, but it is uncommon.

Why it feels strange:

- now you created a custom type whose value is already a pointer
- this usually makes the code less obvious for beginners
- in most codebases, plain `*User` is clearer

Important limitation:

- you cannot define methods with `UserPtr` as receiver
- so this pattern is usually not worth it unless you have a very specific reason

---

## 9. Value Copy vs Shared Address

This is where many beginners get confused.

### Copying the value

```go
u1 := User{Name: "Ana", Age: 20}
u2 := u1

u2.Age = 99

fmt.Println(u1.Age) // 20
fmt.Println(u2.Age) // 99
```

Here `u2` is a copy.

### Sharing the same address

```go
u1 := User{Name: "Ana", Age: 20}
p1 := &u1
p2 := &u1

p2.Age = 99

fmt.Println(u1.Age) // 99
fmt.Println(p1.Age) // 99
fmt.Println(p2.Age) // 99
```

Here everyone points to the same original value.

---

## 10. Nil Pointers

```go
var p *int
fmt.Println(p == nil) // true
```

The zero value of a pointer is `nil`.

If you do this:

```go
fmt.Println(*p)
```

you get a panic:

```text
panic: runtime error: invalid memory address or nil pointer dereference
```

So:

- a pointer can exist without pointing anywhere
- `nil` means "points nowhere"
- dereferencing a `nil` pointer crashes

---

## 11. Function Receiving a Pointer

```go
package main

import "fmt"

func increase(n *int) {
    *n = *n + 1
}

func main() {
    x := 10
    increase(&x)
    fmt.Println(x) // 11
}
```

Why pass `&x`?

Because the function wants `*int`, not `int`.

This lets the function modify the original variable.

---

## 12. Function Receiving a Struct Pointer

```go
package main

import "fmt"

type Counter struct {
    Value int
}

func increment(c *Counter) {
    c.Value++
}

func main() {
    item := Counter{Value: 7}
    increment(&item)
    fmt.Println(item.Value) // 8
}
```

This is one of the most common real uses of pointers in Go.

---

## 13. `new` vs `make`

These are often confused.

### `new(T)`

```go
p := new(int)
fmt.Println(*p) // 0
```

- allocates space for a zero value of type `T`
- returns `*T`

So `new(int)` returns `*int`.

### `make(...)`

Used only for:

- `slice`
- `map`
- `chan`

Example:

```go
s := make([]int, 3)
m := make(map[string]int)
ch := make(chan int)
```

`make` does not return a pointer. It returns an initialized usable value.

---

## 14. Slices and Maps: Important Edge Case

Slices and maps already behave like reference-style data structures in many cases.

### Slice

```go
func changeFirst(s []int) {
    s[0] = 999
}

func main() {
    nums := []int{1, 2, 3}
    changeFirst(nums)
    fmt.Println(nums) // [999 2 3]
}
```

Even without `*[]int`, the function changed the visible content.

But this is different:

```go
func appendWrong(s []int) {
    s = append(s, 4)
}
```

This may not update the caller's slice variable itself.

If you need to replace the slice header, use a pointer:

```go
func appendRight(s *[]int) {
    *s = append(*s, 4)
}
```

### Map

```go
func put(m map[string]int) {
    m["x"] = 10
}
```

This works without `*map[string]int`.

In practice, pointers to slices/maps are much less common than pointers to structs.

---

## 15. Addressable vs Non-Addressable Values

You can only use `&` on addressable values.

### Allowed

```go
x := 10
p := &x
```

```go
u := User{Name: "Ana"}
p := &u
```

```go
p := &User{Name: "Ana"}
```

### Not allowed

```go
// p := &(x + 1)
```

Why not?

Because `x + 1` is a temporary result, not a normal variable you can point to.

---

## 16. Can I Take the Address of a Field?

Yes, if the field belongs to an addressable struct value.

```go
u := User{Name: "Ana", Age: 20}
agePtr := &u.Age

*agePtr = 99
fmt.Println(u.Age) // 99
```

This is valid and useful.

---

## 17. Common Beginner Trap: `range` Variable Addresses

Be careful here:

```go
items := []User{
    {Name: "A"},
    {Name: "B"},
}

for _, item := range items {
    fmt.Println(&item)
}
```

The `item` variable is a loop variable copy. Its address is not the same as the address of the element inside the slice.

If you need the actual element address, prefer:

```go
for i := range items {
    fmt.Println(&items[i])
}
```

---

## 18. Methods with Value Receiver vs Pointer Receiver

```go
type Counter struct {
    Value int
}

func (c Counter) Show() int {
    return c.Value
}

func (c *Counter) Increment() {
    c.Value++
}
```

- value receiver gets a copy
- pointer receiver can modify the original

Usage:

```go
c := Counter{Value: 1}
c.Increment()
fmt.Println(c.Show()) // 2
```

Go helps with automatic conversions in many common cases.

---

## 19. Interface Holding a Nil Pointer

This is a classic edge case:

```go
var p *int = nil
var i interface{} = p

fmt.Println(p == nil) // true
fmt.Println(i == nil) // false
```

Why is `i != nil`?

Because the interface contains:

- a concrete type: `*int`
- a value: `nil`

So the interface itself is not empty.

---

## 20. What Go Does Not Allow

### Pointer arithmetic

This is not valid in normal Go:

```go
// p = p + 1
```

### Dereferencing nil

Also invalid at runtime:

```go
var p *int
// fmt.Println(*p)
```

### Random unsafe tricks

Go does have `unsafe.Pointer`, but that is advanced territory and should not be part of a beginner mental model.

---

## 21. When Should I Use a Pointer?

Use a pointer when:

- you want to modify the original value
- the struct is large and you want to avoid copying
- `nil` has real meaning in your API

Prefer plain values when:

- the data is small
- you do not need mutation
- copying is fine and simpler

For beginners, a very practical rule is:

> Most of the time, use pointers mainly with structs and when mutation is intended.

---

## 22. Short Cheatsheet

| Code           | Meaning                                       |
| -------------- | --------------------------------------------- |
| `p := &x`      | get the address of `x`                        |
| `*p`           | read the value pointed to by `p`              |
| `*p = 10`      | change the original value through the pointer |
| `var p *int`   | declare a pointer to int                      |
| `p == nil`     | pointer points nowhere                        |
| `new(T)`       | allocate zero value and return `*T`           |
| `make([]T, n)` | create initialized slice                      |

---

## 23. Final Summary

- `&` gets an address
- `*` follows an address
- two pointers can point to the same variable
- if two pointers point to the same struct, both change the same struct
- pointers are most useful when you want mutation
- `nil` pointers exist and must be checked
- slices and maps are special cases and often do not need extra pointers

---

# PT

# Guia Didático — `*` e `&` em Go

> Esta versão foi reescrita para iniciantes. A ideia aqui é trocar "definições técnicas demais" por uma explicação que ajude você a visualizar o que acontece entre variável, endereço e ponteiro.

---

## Modelo Mental Rápido

Pense assim:

- Uma variável comum guarda um valor.
- Um ponteiro guarda o endereço de outra variável.
- `&x` significa: "me dê o endereço de `x`".
- `*p` significa: "vá até o endereço que está em `p` e leia ou altere o valor que está lá".

Se você lembrar de uma única frase, lembre desta:

> `&` pega o endereço. `*` segue o endereço.

---

## 1. O Exemplo Mais Simples Possível

```go
package main

import "fmt"

func main() {
    x := 10
    p := &x

    fmt.Println(x)  // 10
    fmt.Println(p)  // endereço de x
    fmt.Println(*p) // 10

    *p = 99
    fmt.Println(x) // 99
}
```

O que aconteceu:

- `x` guarda `10`
- `p` guarda o endereço de `x`
- `*p` lê o valor que mora naquele endereço
- `*p = 99` altera o próprio `x`

---

## 2. Como Ler os Tipos

```go
var x int
var p *int
```

- `x` é um `int`
- `p` é um "ponteiro para int"

Ou seja:

- `x` guarda um valor como `10`
- `p` guarda "onde esse `int` está na memória"

---

## 3. `&` e `*` Sem Mistério

### `&` significa "endereço de"

```go
x := 42
p := &x
```

Aqui:

- `x` é `42`
- `&x` é "o endereço de `x`"
- `p` recebe esse endereço

### `*` significa "valor que está nesse endereço"

```go
fmt.Println(*p)
```

Isso quer dizer:

- "pegue o endereço guardado em `p`"
- "vá até lá"
- "me mostre o valor"

---

## 4. Dois Ponteiros Apontando Para a Mesma Coisa

Esse é um dos edge cases mais importantes de entender.

```go
package main

import "fmt"

func main() {
    something := 123

    a1 := &something
    a2 := &something

    fmt.Println(*a1) // 123
    fmt.Println(*a2) // 123

    *a1 = 500

    fmt.Println(something) // 500
    fmt.Println(*a1)       // 500
    fmt.Println(*a2)       // 500
}
```

Por que isso acontece?

- `a1` e `a2` apontam para a mesma variável
- existe um único valor real sendo alterado
- se você muda por um ponteiro, o outro enxerga a mudança

Então, no caso que você comentou:

- `a1` apontando para `&something`
- `a2` também apontando para o mesmo `&something`

Resultado: os dois observam e alteram o mesmo dado.

---

## 5. Dois Ponteiros Criados com `&User{}`

```go
package main

import "fmt"

type User struct {
    Name string
    Age  int
}

func main() {
    a1 := &User{
        Name: "Ana",
        Age:  20,
    }
    a2 := &User{
        Name: "Bruno",
        Age:  30,
    }

    a1.Age = 21
    a2.Name = "Bruno Lima"

    fmt.Println(*a1) // {Ana 21}
    fmt.Println(*a2) // {Bruno Lima 30}
}
```

Aqui:

- `a1 := &User{...}` cria uma struct e aponta para ela
- `a2 := &User{...}` cria outra struct e aponta para essa outra
- mesmo que os dois sejam `*User`, eles apontam para objetos diferentes
- alterar `a1` não altera `a2`

Essa situação é diferente da seção anterior:

- antes, os dois ponteiros apontavam para a mesma coisa
- aqui, cada ponteiro tem sua própria struct

---

## 6. Dois Ponteiros para a Mesma Struct Já Criada

```go
package main

import "fmt"

type User struct {
    Name string
    Age  int
}

func main() {
    something := User{
        Name: "Ana",
        Age:  20,
    }

    a1 := &something
    a2 := &something

    a1.Age = 21
    a2.Name = "Ana Clara"

    fmt.Println(something) // {Ana Clara 21}
    fmt.Println(*a1)       // {Ana Clara 21}
    fmt.Println(*a2)       // {Ana Clara 21}
}
```

Aqui a ideia é:

- a struct já existe em `something`
- `a1` e `a2` apontam para essa mesma struct já existente
- os dois ponteiros compartilham o mesmo dado

---

## 7. Struct Valor vs Ponteiro para Struct

Essas duas coisas são diferentes:

```go
u := User{Name: "Ana", Age: 20} // a struct em si
p := &u                         // ponteiro para a struct
```

- `u` é o valor da struct
- `p` é o endereço da struct

Você pode acessar campos assim:

```go
u.Name
p.Name
```

Por que `p.Name` funciona?

Porque o Go entende automaticamente isso como:

```go
(*p).Name
```

Ou seja: ele desreferencia sozinho para acessar o campo.

---

## 8. Ponteiro para uma Struct Literal

Você não precisa sempre criar a struct antes em outra linha.

```go
p := &User{
    Name: "Bruno",
    Age:  30,
}
```

Isso é muito comum em Go.

O significado é:

- cria uma `User`
- pega o endereço dela imediatamente
- guarda esse endereço em `p`

### Caso estranho, mas válido: criar um tipo que já é ponteiro

Você também pode definir um tipo cujo tipo subjacente é um ponteiro:

```go
type UserPtr *User
```

E depois usar assim:

```go
var p UserPtr = &User{
    Name: "Ana",
    Age:  20,
}

fmt.Println((*p).Age)
fmt.Println(p.Name)
```

Isso é Go válido, mas é incomum.

Por que parece estranho:

- agora você criou um tipo customizado cujo valor já é um ponteiro
- isso costuma deixar o código menos óbvio para quem está aprendendo
- na maioria dos projetos, `*User` puro é mais claro

Limitação importante:

- você não pode definir métodos com `UserPtr` como receiver
- então esse padrão normalmente não compensa, a menos que exista um motivo bem específico

---

## 9. Cópia de Valor vs Compartilhar o Mesmo Endereço

Esse é outro ponto que costuma confundir iniciantes.

### Copiando o valor

```go
u1 := User{Name: "Ana", Age: 20}
u2 := u1

u2.Age = 99

fmt.Println(u1.Age) // 20
fmt.Println(u2.Age) // 99
```

Aqui `u2` é uma cópia.

### Compartilhando o mesmo endereço

```go
u1 := User{Name: "Ana", Age: 20}
p1 := &u1
p2 := &u1

p2.Age = 99

fmt.Println(u1.Age) // 99
fmt.Println(p1.Age) // 99
fmt.Println(p2.Age) // 99
```

Aqui todo mundo está olhando para o mesmo valor original.

---

## 10. Ponteiro `nil`

```go
var p *int
fmt.Println(p == nil) // true
```

O valor zero de um ponteiro é `nil`.

Se você fizer isso:

```go
fmt.Println(*p)
```

vai acontecer `panic`:

```text
panic: runtime error: invalid memory address or nil pointer dereference
```

Então:

- um ponteiro pode existir sem apontar para lugar nenhum
- `nil` significa "não aponta para nada"
- desreferenciar `nil` quebra o programa

---

## 11. Função Recebendo Ponteiro

```go
package main

import "fmt"

func increase(n *int) {
    *n = *n + 1
}

func main() {
    x := 10
    increase(&x)
    fmt.Println(x) // 11
}
```

Por que passar `&x`?

Porque a função quer `*int`, não `int`.

Assim ela consegue alterar a variável original.

---

## 12. Função Recebendo Ponteiro para Struct

```go
package main

import "fmt"

type Counter struct {
    Value int
}

func increment(c *Counter) {
    c.Value++
}

func main() {
    item := Counter{Value: 7}
    increment(&item)
    fmt.Println(item.Value) // 8
}
```

Esse é um dos usos mais comuns de ponteiros no dia a dia em Go.

---

## 13. `new` vs `make`

Esses dois costumam ser confundidos.

### `new(T)`

```go
p := new(int)
fmt.Println(*p) // 0
```

- aloca espaço para um valor zero do tipo `T`
- retorna `*T`

Então `new(int)` devolve `*int`.

### `make(...)`

Usado apenas para:

- `slice`
- `map`
- `chan`

Exemplo:

```go
s := make([]int, 3)
m := make(map[string]int)
ch := make(chan int)
```

`make` não retorna ponteiro. Ele retorna um valor já inicializado e pronto para uso.

---

## 14. Slice e Map: Edge Case Importante

Slices e maps já têm um comportamento de "referência interna" em muitos cenários.

### Slice

```go
func changeFirst(s []int) {
    s[0] = 999
}

func main() {
    nums := []int{1, 2, 3}
    changeFirst(nums)
    fmt.Println(nums) // [999 2 3]
}
```

Mesmo sem `*[]int`, a função alterou o conteúdo visível.

Mas isso é diferente:

```go
func appendWrong(s []int) {
    s = append(s, 4)
}
```

Isso pode não atualizar a variável slice do chamador.

Se você precisa trocar o cabeçalho do slice, use ponteiro:

```go
func appendRight(s *[]int) {
    *s = append(*s, 4)
}
```

### Map

```go
func put(m map[string]int) {
    m["x"] = 10
}
```

Isso funciona sem `*map[string]int`.

Na prática, ponteiro para slice/map é bem menos comum do que ponteiro para struct.

---

## 15. Valores Endereçáveis vs Não Endereçáveis

Você só pode usar `&` em algo que tenha endereço válido.

### Permitido

```go
x := 10
p := &x
```

```go
u := User{Name: "Ana"}
p := &u
```

```go
p := &User{Name: "Ana"}
```

### Não permitido

```go
// p := &(x + 1)
```

Por quê?

Porque `x + 1` é um resultado temporário, e não uma variável normal com endereço acessível.

---

## 16. Posso Pegar o Endereço de um Campo?

Sim, se o campo pertence a uma struct endereçável.

```go
u := User{Name: "Ana", Age: 20}
agePtr := &u.Age

*agePtr = 99
fmt.Println(u.Age) // 99
```

Isso é válido e bastante útil.

---

## 17. Armadilha Comum: Endereço da Variável do `range`

Cuidado com isso:

```go
items := []User{
    {Name: "A"},
    {Name: "B"},
}

for _, item := range items {
    fmt.Println(&item)
}
```

A variável `item` do loop é uma cópia temporária. O endereço dela não é o endereço real do elemento dentro do slice.

Se você quer o endereço do elemento verdadeiro, prefira:

```go
for i := range items {
    fmt.Println(&items[i])
}
```

---

## 18. Métodos com Receptor Valor vs Receptor Ponteiro

```go
type Counter struct {
    Value int
}

func (c Counter) Show() int {
    return c.Value
}

func (c *Counter) Increment() {
    c.Value++
}
```

- receptor valor recebe uma cópia
- receptor ponteiro pode alterar o original

Uso:

```go
c := Counter{Value: 1}
c.Increment()
fmt.Println(c.Show()) // 2
```

O Go ajuda com conversões automáticas em muitos casos do dia a dia.

---

## 19. Interface Guardando Ponteiro `nil`

Esse é um edge case clássico:

```go
var p *int = nil
var i interface{} = p

fmt.Println(p == nil) // true
fmt.Println(i == nil) // false
```

Por que `i != nil`?

Porque a interface contém:

- um tipo concreto: `*int`
- um valor: `nil`

Então a interface em si não está vazia.

---

## 20. O Que Go Não Permite

### Aritmética de ponteiro

Isso não é válido em Go normal:

```go
// p = p + 1
```

### Desreferenciar `nil`

Também é inválido em runtime:

```go
var p *int
// fmt.Println(*p)
```

### Truques aleatórios com `unsafe`

Go até tem `unsafe.Pointer`, mas isso já é assunto avançado e não deve fazer parte do modelo mental de quem está começando.

---

## 21. Quando Eu Devo Usar Ponteiro?

Use ponteiro quando:

- você quer alterar o valor original
- a struct é grande e você quer evitar cópias
- `nil` tem significado real na sua API

Prefira valor comum quando:

- o dado é pequeno
- você não precisa de mutação
- copiar é simples e deixa o código mais claro

Uma regra prática boa para iniciantes:

> Na maior parte do tempo, use ponteiros principalmente com structs e quando a intenção for mutar.

---

## 22. Cheatsheet Rápido

| Código         | Significado                                  |
| -------------- | -------------------------------------------- |
| `p := &x`      | pega o endereço de `x`                       |
| `*p`           | lê o valor apontado por `p`                  |
| `*p = 10`      | altera o valor original por meio do ponteiro |
| `var p *int`   | declara um ponteiro para int                 |
| `p == nil`     | o ponteiro não aponta para lugar nenhum      |
| `new(T)`       | aloca valor zero e retorna `*T`              |
| `make([]T, n)` | cria slice inicializado                      |

---

## 23. Resumo Final

- `&` pega endereço
- `*` segue o endereço
- dois ponteiros podem apontar para a mesma variável
- se dois ponteiros apontam para a mesma struct, os dois alteram a mesma struct
- ponteiro é mais útil quando você quer mutação
- ponteiro `nil` existe e precisa de cuidado
- slice e map são casos especiais e normalmente não precisam de ponteiro extra
