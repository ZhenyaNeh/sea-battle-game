import { useState } from 'react';
import { motion } from 'framer-motion';

// Компонент для отрисовки точек на кубике
export const DiceFace = ({ value }: { value: number }) => {
  const dotPositions: Record<number, Array<[number, number]>> = {
    1: [[0, 0]],
    2: [
      [-0.3, -0.3],
      [0.3, 0.3],
    ],
    3: [
      [-0.3, -0.3],
      [0, 0],
      [0.3, 0.3],
    ],
    4: [
      [-0.3, -0.3],
      [-0.3, 0.3],
      [0.3, -0.3],
      [0.3, 0.3],
    ],
    5: [
      [-0.3, -0.3],
      [-0.3, 0.3],
      [0, 0],
      [0.3, -0.3],
      [0.3, 0.3],
    ],
    6: [
      [-0.3, -0.3],
      [-0.3, 0],
      [-0.3, 0.3],
      [0.3, -0.3],
      [0.3, 0],
      [0.3, 0.3],
    ],
  };

  return (
    <>
      {dotPositions[value].map(([x, y], index) => (
        <div
          key={index}
          className="absolute w-5 h-5 rounded-[50%] bg-[#dfdad7] top-[50%] left-[50%]"
          style={{
            transform: `translate(-50%, -50%) translate(${x * 80}px, ${y * 80}px)`,
          }}
        />
      ))}
    </>
  );
};

const getWeightedRandom = () => {
  const probabilities = [40, 15, 15, 13, 10, 8];
  const random = Math.random() * 100;

  let sum = 0;
  for (let i = 0; i < probabilities.length; i++) {
    sum += probabilities[i];
    if (random <= sum) return i + 1;
  }
  return 6;
};

export default function RollDice() {
  const [value, setValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  const rollDice = () => {
    if (isRolling) return; // Защита от повторного клика во время анимации

    setIsRolling(true);
    const newValue = getWeightedRandom();

    // После завершения анимации обновляем значение
    setTimeout(() => {
      setValue(newValue);
      setIsRolling(false);
    }, 1000);
  };

  return (
    <motion.div
      onClick={rollDice}
      animate={{
        rotate: isRolling ? [0, 360, 720] : 0,
        scale: isRolling ? [1, 1.2, 1] : 1,
      }}
      transition={{
        duration: 1,
        ease: 'easeOut',
      }}
      className="w-[100px] h-[100px] bg-muted rounded-[15px] relative cursor-pointer flex justify-center items-center select-none"
    >
      <DiceFace value={value} />
    </motion.div>
  );
}

// import { motion } from 'framer-motion';

// export default function RollDice() {
//   return (
//     <motion.div
//       animate={{
//         rotate: [0, 90, 180, 270, 360],
//         scale: [1, 1.2, 1],
//       }}
//       transition={{
//         duration: 2,
//         repeat: Infinity,
//       }}
//       style={{
//         width: 100,
//         height: 100,
//         backgroundColor: 'tomato',
//         borderRadius: 10,
//       }}
//     />
//   );
// }
