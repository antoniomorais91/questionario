import QuestaoModel from '@/model/questao'
import styles from '../styles/Questionario.module.css'
import Questao from './Questao'
import Botao from './Botao'

interface QuestionarioProps {
    questao: QuestaoModel
    ultima: boolean
    questaoRespondida: (questao: QuestaoModel) => void
    irProximoPasso: () => void
}

export default function Questionario(props: QuestionarioProps) {

    function respostaFornecida(indice: number) {
        if(props.questao.naorespondida) {
            props.questaoRespondida(props.questao.responderCom(indice))
        }
    }

    return (
        <div className={styles.questionario}>
            {props.questao ?
                <Questao
                    valor={props.questao}
                    tempoResposta={6}
                    respostaFornecida={respostaFornecida}
                    tempoEsgotado={props.irProximoPasso} />
                : false
            }

            <Botao onClick={props.irProximoPasso}
                texto={props.ultima ? 'Finalizar' : 'Próxima'}
            />
        </div>
    )
}