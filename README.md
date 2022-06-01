# Multi-Sig Wallet as a Service

🚀 Built with [Scaffold-Eth](https://github.com/scaffold-eth/scaffold-eth)

✨ Demo deployed on Rinkeby testnet: https://.surge.sh/ 

Create multiple multisignature wallets and see their details as well as propose, execute, and sign transactions - all in just a few clicks.


# 🏄‍♂️ Getting Started Locally

Prerequisites: [Node (v16 LTS)](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🪄 MaaS:

```bash
git clone 
```

> install and start your 👷‍ Hardhat chain:

```bash
cd maas
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd maas
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd maas
yarn deploy
```

> in a fourth terminal window, 🗄 start your backend:

```bash
cd maas
yarn backend
```

📱 Open http://localhost:3000 to see the app

# 📚 Documentation

Documentation, tutorials, challenges, and many more resources, visit: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)

# 💌 P.S.

🌍 You need an RPC key for testnets and production deployments, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js` with your new key.

📣 Make sure you update the `InfuraID` before you go to production. Huge thanks to [Infura](https://infura.io/) for our special account that fields 7m req/day!
