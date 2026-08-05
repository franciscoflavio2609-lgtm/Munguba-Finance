# Guia de Publicação na Google Play Store — Munguba Finance

## Pré-requisitos
- [ ] Conta de desenvolvedor Google Play (taxa única de US$ 25) — https://play.google.com/console/signup
- [ ] App publicado e funcionando no Vercel (já feito ✅)

## Passo a passo

### 1. Gerar o pacote Android com PWA Builder
1. Acesse https://www.pwabuilder.com
2. Cole a URL do Munguba (ex: `https://munguba-finance-zp74.vercel.app`)
3. Clique em **Start**
4. Aguarde a análise (nota de 0 a 100 sobre a "qualidade PWA")
5. Clique em **Package for Stores** → selecione **Android**
6. Preencha:
   - Package ID: `com.mungubafinance.app`
   - App name: `Munguba Finance`
   - Baixe o arquivo `.aab` gerado

### 2. Configurar o Digital Asset Link
1. Durante a geração, o PWA Builder mostra uma **SHA-256 fingerprint**
2. Copie esse valor
3. Abra `public/.well-known/assetlinks.json` neste projeto
4. Substitua `SUBSTITUA_PELA_IMPRESSAO_DIGITAL_GERADA_PELO_PWA_BUILDER` pelo valor copiado
5. Publique o código atualizado (git push de sempre)
6. Confirme que `https://seu-dominio.vercel.app/.well-known/assetlinks.json` abre corretamente no navegador

### 3. Enviar para o Google Play Console
1. Acesse https://play.google.com/console
2. Clique em **Criar app**
3. Preencha:
   - Nome: Munguba Finance
   - Categoria: Finanças
   - Gratuito
4. Envie o arquivo `.aab` gerado no passo 1
5. Preencha a ficha da loja: descrição, screenshots, ícone, política de privacidade
6. Envie para revisão (leva de 1 a 7 dias)

## Observações importantes
- A política de privacidade é obrigatória — pode ser uma página simples explicando que os dados ficam no Supabase e nunca são vendidos
- Screenshots devem mostrar o app em uso real (Dashboard, Educação, Investimentos)
- O ícone já está pronto em `public/icon-512.png`
