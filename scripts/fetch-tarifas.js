/**
 * Atualiza as tarifas residenciais B1 da ANEEL usadas pelo mapa.
 * Requer Node.js 18+.
 */

const fs = require("node:fs/promises");
const path = require("node:path");

const RESOURCE_ID = "fcf2906c-7c32-4b9b-a637-054e7a5234f4";
const BASE_URL = "https://dadosabertos.aneel.gov.br/api/action/datastore_search";
const PAGE_SIZE = 1000;
const OUTPUT_FILE = path.resolve(__dirname, "../mapa/dados-tarifas.json");

function parseValor(valor) {
  if (valor === null || valor === undefined || valor === "") return null;
  const numero = Number(String(valor).replace(",", "."));
  return Number.isNaN(numero) ? null : numero;
}

async function buscarPagina(offset) {
  const filters = encodeURIComponent(JSON.stringify({
    DscSubGrupo: "B1",
    DscClasse: "Residencial"
  }));
  const url = `${BASE_URL}?resource_id=${RESOURCE_ID}&filters=${filters}&limit=${PAGE_SIZE}&offset=${offset}`;
  let ultimoErro;
  for (let tentativa = 1; tentativa <= 4; tentativa++) {
    try {
      const resposta = await fetch(url, { signal: AbortSignal.timeout(60000) });
      if (!resposta.ok) {
        throw new Error(`Erro HTTP ${resposta.status} ao buscar offset ${offset}`);
      }

      const dados = await resposta.json();
      if (!dados.success) {
        throw new Error(`API retornou success=false: ${JSON.stringify(dados)}`);
      }

      return dados.result;
    } catch (erro) {
      ultimoErro = erro;
      if (tentativa < 4) {
        await new Promise((resolver) => setTimeout(resolver, tentativa * 1000));
      }
    }
  }

  throw ultimoErro;
}

async function buscarTodosOsRegistros() {
  const primeiraPagina = await buscarPagina(0);
  const offsetsRestantes = [];

  for (let offset = PAGE_SIZE; offset < primeiraPagina.total; offset += PAGE_SIZE) {
    offsetsRestantes.push(offset);
  }

  const paginasRestantes = [];
  for (let inicio = 0; inicio < offsetsRestantes.length; inicio += 8) {
    const lote = offsetsRestantes.slice(inicio, inicio + 8);
    paginasRestantes.push(...await Promise.all(lote.map(buscarPagina)));
  }

  return [primeiraPagina, ...paginasRestantes].flatMap((pagina) => pagina.records);
}

function selecionarTarifas(registros) {
  const maisRecentePorAgente = new Map();

  for (const registro of registros) {
    const agente = registro.SigAgente;
    if (!agente) continue;

    const atual = maisRecentePorAgente.get(agente);
    const vigente = !registro.DatFimVigencia;
    const inicio = registro.DatInicioVigencia || "";

    if (!atual) {
      maisRecentePorAgente.set(agente, registro);
      continue;
    }

    const atualVigente = !atual.DatFimVigencia;
    const atualInicio = atual.DatInicioVigencia || "";
    if ((vigente && !atualVigente) ||
        (vigente === atualVigente && inicio > atualInicio)) {
      maisRecentePorAgente.set(agente, registro);
    }
  }

  return Array.from(maisRecentePorAgente.values())
    .map((registro) => {
      // A ANEEL fornece os valores em R$/MWh; o mapa exibe R$/kWh.
      const teMwh = parseValor(registro.VlrTE);
      const tusdMwh = parseValor(registro.VlrTUSD);
      const vlrTE = teMwh === null ? null : teMwh / 1000;
      const vlrTUSD = tusdMwh === null ? null : tusdMwh / 1000;
      return {
        distribuidora: registro.SigAgente,
        agente: registro.SigAgente,
        subGrupo: registro.DscSubGrupo,
        classe: registro.DscClasse,
        modalidadeTarifaria: registro.DscModalidadeTarifaria,
        inicioVigencia: registro.DatInicioVigencia,
        fimVigencia: registro.DatFimVigencia || null,
        vlrTE,
        vlrTUSD,
        tarifaTotalRsPorKwh: vlrTE !== null && vlrTUSD !== null
          ? +(vlrTE + vlrTUSD).toFixed(6)
          : null
      };
    })
    .filter((tarifa) => tarifa.tarifaTotalRsPorKwh !== null)
    .sort((a, b) => a.distribuidora.localeCompare(b.distribuidora));
}

async function main() {
  const registros = await buscarTodosOsRegistros();
  const tarifas = selecionarTarifas(registros);

  if (tarifas.length === 0) {
    throw new Error("A API não retornou tarifas processáveis.");
  }

  const saida = {
    fonte: "ANEEL - Dados Abertos",
    atualizadoEm: new Date().toISOString(),
    quantidadeDistribuidoras: tarifas.length,
    tarifas
  };

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(saida, null, 2), "utf8");
  console.log(`Tarifas atualizadas: ${tarifas.length} distribuidoras.`);
}

main().catch((erro) => {
  console.error("Erro ao atualizar tarifas:", erro.message);
  process.exitCode = 1;
});
