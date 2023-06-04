import styles from '@/styles/Home.module.css'
import QuestaoModel from '@/model/questao'
import { useEffect, useState } from 'react'
import Questionario from '@/components/Questionario'
import { useRouter } from 'next/router'

const BASE_URL = 'https://questionario-delta.vercel.app/api'

export default function Home() {
  const router = useRouter()

  const [idsDasQuestoes, setIdsDasQuestoes] = useState<number[]>([])
  const [questao, setQuestao] = useState<QuestaoModel>()
  const [respostasCertas, setrespostasCertas] = useState<number>(0)

  async function carregarIdsDasQuestoes() {
    const resp = await fetch(`${BASE_URL}/questionario`)
    const idsDasQuestoes = await resp.json()
    setIdsDasQuestoes(idsDasQuestoes)
  }

  async function carregarQuestao(idQuestao: number) {
    const resp = await fetch(`${BASE_URL}/questoes/${idQuestao}`)
    const json = await resp.json()
    const novaQuestao = QuestaoModel.criarUsandoObj(json)
    setQuestao(novaQuestao)
  }

  useEffect(() => {
    carregarIdsDasQuestoes()
  }, [])

  useEffect(() => {
    idsDasQuestoes.length > 0 && carregarQuestao(idsDasQuestoes[0])
  }, [idsDasQuestoes])

  function questaoRespondida(questaoRespondida: QuestaoModel) {
    setQuestao(questaoRespondida)
    const acertou = questaoRespondida.acertou
    setrespostasCertas(respostasCertas + (acertou ? 1 : 0))
  }

  function idProximaPergunta() {
      const proximoIndice = idsDasQuestoes.indexOf(questao!.id) + 1
      return idsDasQuestoes[proximoIndice]
  }

  function irProximoPasso() {
    const proximoId = idProximaPergunta()
    proximoId ? irProximaQuestao(proximoId) : finalizar()
  }

  function irProximaQuestao(proximoId: number) {
    carregarQuestao(proximoId)

  }

  function finalizar() {
    router.push({
      pathname: "/resultado",
      query: {
        total: idsDasQuestoes.length,
        certas: respostasCertas
      }
    })
  }

  return questao ? (
  <Questionario
    questao={questao}
    ultima={idProximaPergunta() === undefined}
    questaoRespondida={questaoRespondida}
    irProximoPasso={irProximoPasso} />
    ) : false      
}
