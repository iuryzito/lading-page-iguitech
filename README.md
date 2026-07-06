# Landing Page IGUITECH

Landing page estatica da IGUITECH para o dominio principal `iguitech.com`.

## Arquivos principais

- `index.html`: estrutura da landing.
- `styles.css`: layout, responsividade e animacoes.
- `script.js`: interacoes, chat demonstrativo e animacoes.
- `privacy.html`: pagina de privacidade.
- `assets/`: imagens e videos usados na landing.

## Deploy recomendado: EasyPanel

O projeto esta pronto para rodar como container Nginx.

1. Envie este repositorio para o GitHub.
2. No EasyPanel, crie um novo app usando o repositorio.
3. Selecione deploy via Dockerfile.
4. Configure a porta interna como `80`.
5. Aponte o dominio do app para `iguitech.com`.
6. Ative SSL/HTTPS no EasyPanel.

O `Dockerfile` copia a landing para Nginx e o `nginx.conf` configura cache para assets.

## Deploy alternativo: GitHub Pages

O projeto tambem inclui workflow em `.github/workflows/pages.yml`.

1. Em `Settings > Pages`, selecione `GitHub Actions`.
2. Garanta que o arquivo `CNAME` esteja com:

```txt
iguitech.com
```

3. No DNS, crie um CNAME:

```txt
lp -> iuryzito.github.io
```

4. A cada push na branch `main`, o GitHub Pages publica a landing.

## Desenvolvimento local

Rode um servidor estatico na pasta do projeto:

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Depois acesse:

```txt
http://localhost:4173/
```
