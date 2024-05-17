import PodiumStep from './PodiumStep'
export default function Podium({ winners }) {
  /*const podium = [8, 6, 4, 2, 0, 1, 3, 5, 7, 9]
    .reduce((podiumOrder, position) => [...podiumOrder, winners[position]], [])
    .filter(Boolean)*/
    const sortedLancesFrete = Array.isArray(winners)? [...winners].sort((a, b) => a.valor_lance - b.valor_lance) : [];


    const podiumWithPositions = sortedLancesFrete.map((winner, index) => ({
      ...winner,
       position: index, // Adiciona a posição, começando de 1
     }));

    //const podium = sortedLancesFrete.reduce((podiumOrder, lance, index) => [...podiumOrder, lance], []).slice(0, 3);
    const podium = podiumWithPositions.slice(0, 3);
  return (
    <div
      style={{
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        borderBottom: '1px solid #e5e7eb',
        display: 'grid',
        gap: '.5rem',
        gridAutoFlow: 'column dense',
        justifyContent: 'center',
        justifyItems: 'center',
        height: 250,
        marginTop: '2rem',
      }}
    >
      {podium.map((winner) => (
        <PodiumStep key={winner.id} podium={podium} winner={winner} />
      ))}
    </div>
  )
}