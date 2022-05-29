<p align="center">
  <a href="https://github.com/pooltogether/pooltogether--brand-assets">
    <img src="https://github.com/pooltogether/pooltogether--brand-assets/blob/977e03604c49c63314450b5d432fe57d34747c66/logo/pooltogether-logo--purple-gradient.png?raw=true" alt="PoolTogether Brand" style="max-width:100%;" width="200">
  </a>
</p>

<br />

## PoolTogether v4 TWAB Subgraph

[![Coveralls](https://github.com/pooltogether/twab-subgraph/actions/workflows/main.yml/badge.svg)](https://github.com/pooltogether/twab-subgraph/actions/workflows/main.yml)

Monitors changes in v4 Ticket TWAB.

### Quick-use:

#### For Mainnet:

```sh
$ yarn clean && yarn prepare:mainnet && yarn gen:mainnet && yarn deploy:mainnet
```

#### For Polygon:

```sh
$ yarn clean && yarn prepare:polygon && yarn gen:polygon && yarn deploy:polygon
```

#### For Avalanche:

```sh
$ yarn clean && yarn prepare:avalanche && yarn gen:avalanche && yarn deploy:avalanche
```

#### For Optimism-Kovan:

```sh
$ yarn clean && yarn prepare:optimism-kovan && yarn gen:optimism-kovan && yarn deploy:optimism-kovan
```

### Hosted Subgraphs

Subgraphs are hosted at the following URLs:

-   https://thegraph.com/hosted-service/subgraph/pooltogether/mainnet-twab
-   https://thegraph.com/hosted-service/subgraph/pooltogether/polygon-twab
-   https://thegraph.com/hosted-service/subgraph/pooltogether/avalanche-twab
-   https://thegraph.com/hosted-service/subgraph/underethsea/pool-together-optimism-kovan-twab
