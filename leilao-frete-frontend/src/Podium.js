import PodiumStep from './PodiumStep'
export default function Podium({ winners }) {
  const sortedLancesFrete = Array.isArray(winners)? [...winners].sort((a, b) => a.valor_lance - b.valor_lance) : [];
  
  
  const podiumWithPositions = sortedLancesFrete.map((winner, index) => ({
    ...winner,
    position: index,
  }));
  
  const podium = [1,0,2]
    .reduce((podiumOrder, position) => [...podiumOrder, podiumWithPositions[position]], [])
    .filter(Boolean)

  //const podium = sortedLancesFrete.reduce((podiumOrder, lance, index) => [...podiumOrder, lance], []).slice(0, 3);
  //const podium = podiumWithPositions.slice(0, 3);

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