# Icarus — primeira versão em código

Página estática em HTML, CSS e JavaScript. Sem instalação de dependências.

## Executar

Na pasta `icarus-site`:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Abra http://127.0.0.1:4173.

## Editar

- `index.html`: textos e estrutura das seções.
- `styles.css`: paleta, tipografia, espaçamento e telas responsivas.
- `app.js`: menu mobile e escolha do tipo de projeto.
- `site.config.js`: canal de atendimento. Preencha `contactEmail` ou `whatsapp` para ativar o botão. Se ambos estiverem preenchidos, o WhatsApp tem prioridade.
- `assets/logo.svg`: logo em vetor na paleta azul e lima.

A fonte Manrope é carregada pelo Google Fonts; Arial é o fallback quando não há rede. As perguntas frequentes usam o elemento nativo `details`. Os links internos e FAQs funcionam sem JavaScript; o JavaScript controla o menu mobile e o canal de atendimento.

Esta versão não coleta nem envia dados. O contato só é habilitado quando um canal válido é configurado. Não há formulário, backend, analytics ou publicação externa.

Paleta em teste: azul `#0131CD`, branco `#FFFFFF` e lima `#B9FC01`. As cores auxiliares são variações do azul e do branco.


Assets oficiais da Shopify: https://www.shopify.com/brand-assets. Usados para identificar a plataforma; não há declaração de parceria ou selo de Partner.

## Blog

A listagem fica em `blog/index.html`. Cada artigo tem uma pasta com seu próprio `index.html`; adicione seu link à listagem ao publicar.
