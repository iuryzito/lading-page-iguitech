# Landing Page IGUITECH

Landing page principal para venda de acesso ao sistema IGUITECH.

## Estrutura

- `index.html`: estrutura da página.
- `styles.css`: visual responsivo da landing.
- `script.js`: animações, scroll suave e carregamento leve do vídeo.
- `assets/images/`: imagens usadas na landing.

## Vídeo principal

O vídeo atual é carregado pelo YouTube apenas após o clique do visitante:

- https://youtu.be/P6GuBffAJEE

Isso mantém o primeiro carregamento mais leve no mobile.

## Imagens

As imagens finais devem ser colocadas em `assets/images/`, preferencialmente em:

- `webp` para fotos e banners.
- `png` apenas quando precisar de transparência.
- versões separadas para mobile e desktop quando a imagem for grande.

Sugestão de nomes:

- `iury-hero-desktop.webp`
- `iury-hero-mobile.webp`
- `iury-founder.webp`
- `sistema-whatsapp.webp`
- `dashboard-notebook.webp`
- `clientes-grid.webp`

## Deploy no GitHub Pages

Este projeto já inclui workflow em `.github/workflows/pages.yml`.

Depois de criar o repositório `lading-page-iguitech` no GitHub:

1. Envie o código para a branch `main`.
2. Em `Settings > Pages`, selecione `GitHub Actions`.
3. A cada push na `main`, o site será publicado automaticamente.

## Desenvolvimento local

Como é uma landing estática, basta abrir `index.html` no navegador.
