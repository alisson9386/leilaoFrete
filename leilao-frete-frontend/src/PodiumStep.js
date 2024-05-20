import { motion } from 'framer-motion'
export default function PodiumStep({ podium, winner }) {
  const offset = podium.length - winner.position
  const formatarComVirgula = (numero) => {
    if (numero) {
      return numero.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        placeContent: 'center',
      }}
    >
      <motion.div
        style={{
          alignSelf: 'center',
          marginBottom: '.25rem',
          textAlign: 'center'
        }}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              //delay: 1 + (offset + 2),
              duration: 0.75,
            },
          },
        }}
      >
        <img
          src={`https://img.freepik.com/vetores-gratis/caminhao-de-transporte-desenhado-a-mao_23-2149166402.jpg`}
          alt=""
          style={{
            borderRadius: 9999,
            height: '2.75rem',
            overflow: 'hidden',
            width: '2.75rem',
          }}
        /><br/>
        {winner.proprietario.nome}<br/>
        R$ {formatarComVirgula(winner.valor_lance)}
      </motion.div>
      <motion.div
        style={{
          backgroundColor: 'rgba(13,110,253)',
          borderColor: 'rgba(190,24,93,1)',
          borderTopLeftRadius: '.5rem',
          borderTopRightRadius: '.5rem',
          display: 'flex',
          filter: `opacity(${0.1 + offset / podium.length})`,
          marginBottom: -1,
          placeContent: 'center',
          width: '7rem',
        }}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { height: 0, opacity: 0 },
          visible: {
            height: 200 * (offset / podium.length),
            opacity: 1,
            transition: {
              //delay: 1 + offset,
              duration: 2,
              ease: 'backInOut',
            },
          },
        }}
      >
        <span style={{ alignSelf: 'flex-end', color: 'white' }}>
          {winner.position + 1 + '°'}
        </span>
      </motion.div>
    </div>
  )
}