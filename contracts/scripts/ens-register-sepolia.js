// Register retorn.eth on ENSv2 (Sepolia) and point it at our RetornResolver.
// ENSv2 contracts from https://docs.ens.domains/learn/deployments (Sepolia ENSv2).
// Rent is paid in the Sepolia MockUSDC test token (publicly mintable).
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "deployed.sepolia.json");
const art = (n) => JSON.parse(fs.readFileSync(path.join(ROOT, "build", `${n}.json`), "utf8"));

const ENS = {
  registrar: "0xf633e7fc17e2bbe0d0965d18ec1821dcb754a3d3", // ETHRegistrar (ENSv2)
  ethRegistry: "0xd4ebcbbdf463c9c45784603db0ddd499bc44a8b4", // ETHRegistry (ENSv2)
  usdc: "0x240b0316df57887dbbe58b586508b19e633a14aa", // MockUSDC
};
const LABEL = "retorn";
const DURATION = 31_536_000n; // one year

const registrarAbi = [
  "function MIN_COMMITMENT_AGE() view returns (uint64)",
  "function isAvailable(string) view returns (bool)",
  "function getRegisterPrice(string,uint64,address) view returns (uint256,uint256)",
  "function makeCommitment(string label,address owner,bytes32 secret,address subregistry,address resolver,uint64 duration,bytes32 referrer) view returns (bytes32)",
  "function commit(bytes32)",
  "function register(string label,address owner,bytes32 secret,address subregistry,address resolver,uint64 duration,address paymentToken,bytes32 referrer)",
];
const registryAbi = [
  "function getResolver(string) view returns (address)",
  "function findOwner(string) view returns (address)",
];
const erc20Abi = [
  "function mint(address,uint256)",
  "function approve(address,uint256) returns (bool)",
  "function balanceOf(address) view returns (uint256)",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com", 11155111, { staticNetwork: true });
  const w = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  const me = w.address;
  console.log("Deployer:", me, "|", ethers.formatEther(await provider.getBalance(me)), "SepETH");

  const saved = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};

  // 1. Resolver
  let resolverAddr = saved.resolver;
  if (!resolverAddr) {
    const { abi, bytecode } = art("RetornResolver");
    const r = await new ethers.ContractFactory(abi, bytecode, w).deploy(me);
    await r.waitForDeployment();
    resolverAddr = await r.getAddress();
    console.log("1. RetornResolver deployed:", resolverAddr);
    fs.writeFileSync(OUT, JSON.stringify({ ...saved, network: "sepolia", resolver: resolverAddr }, null, 2));
  } else {
    console.log("1. RetornResolver (existing):", resolverAddr);
  }

  const registrar = new ethers.Contract(ENS.registrar, registrarAbi, w);
  const registry = new ethers.Contract(ENS.ethRegistry, registryAbi, w);

  if (!(await registrar.isAvailable(LABEL))) {
    console.log(`${LABEL}.eth is not available; owner:`, await registry.findOwner(LABEL));
    return;
  }

  // 2. Rent in MockUSDC
  const [base, premium] = await registrar.getRegisterPrice(LABEL, DURATION, ENS.usdc);
  const price = base + premium;
  const usdc = new ethers.Contract(ENS.usdc, erc20Abi, w);
  await (await usdc.mint(me, price * 2n)).wait();
  await (await usdc.approve(ENS.registrar, price * 2n)).wait();
  console.log("2. rent:", ethers.formatUnits(price, 6), "MockUSDC (minted + approved)");

  // 3. Commit, wait, register
  const secret = ethers.hexlify(ethers.randomBytes(32));
  const ZERO = ethers.ZeroAddress;
  const REF = ethers.ZeroHash;
  const commitment = await registrar.makeCommitment(LABEL, me, secret, ZERO, resolverAddr, DURATION, REF);
  await (await registrar.commit(commitment)).wait();
  const wait = Number(await registrar.MIN_COMMITMENT_AGE()) + 10;
  console.log(`3. committed; waiting ${wait}s for the commit to mature...`);
  await sleep(wait * 1000);

  const tx = await registrar.register(LABEL, me, secret, ZERO, resolverAddr, DURATION, ENS.usdc, REF);
  const rc = await tx.wait();
  console.log("4. registered retorn.eth:", rc.hash);

  console.log("   owner:", await registry.findOwner(LABEL));
  console.log("   resolver:", await registry.getResolver(LABEL));
  fs.writeFileSync(
    OUT,
    JSON.stringify({ network: "sepolia", ens: "ENSv2", name: "retorn.eth", resolver: resolverAddr, registerTx: rc.hash, owner: me }, null, 2)
  );
}

main().catch((e) => {
  console.error(e.shortMessage || e.message);
  process.exit(1);
});
