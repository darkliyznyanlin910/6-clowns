# Jiak!

## What is `Jiak!`?

Jiak! is an application to tackle food wastage in Singapore by letting users share excess foods that they have with public. It has geo filtering features where users can find food giveaways that are nearest to their location.

## What technologies did we choose?

- [Next.js](https://nextjs.org)
- [Clerk](https://clerk.com/)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [DaisyUI](https://daisyui.com/)
- [tRPC](https://trpc.io)
- [react-webcam](https://github.com/mozmorris/react-webcam)
- [qrcode.react](https://github.com/zpao/qrcode.react)
- [T3 Stack](https://create.t3.gg/) - This project bootstrapped with `create-t3-app`.

## How do I deploy this?

### To [SST](https://sst.dev/) with CI/CD (Currently haven't implemented yet)

Check `~/.github/workflows/deploy.yml` for workflow.

### [Vercel](https://create.t3.gg/en/deployment/vercel)

1. Install Vercel-CLI

```console
npm i -g vercel
```

2. Link project

```console
vercel link
```

3. Deploy

```console
vercel deploy --prod
```
