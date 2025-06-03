export type LessonContent = {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  content: string;
  levelId: number;
  levelData: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  order: number;
};

export const LESSONS: Record<
  "beginner" | "intermediate" | "advanced",
  LessonContent[]
> = {
  beginner: [
    {
      id: "b1",
      title: "Introducción a la Programación",
      description:
        "Aprende los conceptos básicos de la programación y cómo pensar como un programador.",
      videoUrl: "https://www.youtube.com/watch?v=hhmvicWxR9M",
      content: `
# Introducción a la Programación

¡Bienvenido a tu primera lección de programación! En esta lección aprenderás:

## ¿Qué es la Programación?
La programación es como dar instrucciones a una computadora para que realice tareas específicas. Es como enseñar a un robot cómo moverse y qué hacer.

## Conceptos Básicos
1. **Comandos**: Son instrucciones que le decimos al robot qué hacer
2. **Secuencia**: El orden en que ejecutamos los comandos
3. **Repetición**: Hacer que el robot repita acciones

## Tu Primer Programa
Vamos a crear un programa simple que hará que el robot:
1. Se encienda
2. Se mueva hacia adelante
3. Recolecte un objeto
4. Se apague

## Ejemplo de Código
\`\`\`lua
-- Encender el robot
robot:encender()

-- Mover hacia adelante
robot:moverDerecha()

-- Recolectar objeto
robot:recolectar()

-- Apagar el robot
robot:apagar()
\`\`\`

## ¡Es tu turno!
Ahora que has aprendido los conceptos básicos, intenta crear tu propio programa para resolver el nivel.
      `,
      levelId: 1,
      levelData:
        "0x0003010104040102000101010101010100010401010001040104000104040404",
      difficulty: "beginner",
      order: 1,
    },
    {
      id: "b2",
      title: "Bucles y Repeticiones",
      description:
        "Aprende cómo hacer que el robot repita acciones usando bucles.",
      videoUrl: "https://www.youtube.com/watch?v=hhmvicWxR9M",
      content: `
# Bucles y Repeticiones

## ¿Qué es un Bucle?
Un bucle es una forma de hacer que el robot repita una acción varias veces. Es como decirle "haz esto 3 veces".

## Sintaxis de Bucles en Lua
\`\`\`lua
-- Definir cuántas veces queremos repetir
veces = 3

-- Usar el bucle for
for i=1,veces do
  robot:moverDerecha()
end
\`\`\`

## Ejercicio Práctico
Intenta crear un programa que:
1. Defina una variable 'veces' con valor 3
2. Use un bucle para mover el robot a la derecha 'veces' veces
3. Recolecte un objeto al final

## Consejos
- Siempre termina tus bucles con 'end'
- Puedes usar variables para hacer tus programas más flexibles
- Los bucles te ayudan a escribir código más corto y eficiente

## ¡A practicar!
Ahora intenta resolver el nivel usando bucles para hacer tu código más eficiente.
      `,
      levelId: 2,
      levelData:
        "0x0003010104040102000101010101010100010401010001040104000104040404",
      difficulty: "beginner",
      order: 2,
    },
  ],
  intermediate: [
    {
      id: "i1",
      title: "Condicionales y Decisiones",
      description:
        "Aprende a tomar decisiones en tus programas usando condicionales.",
      videoUrl: "https://www.youtube.com/watch?v=hhmvicWxR9M",
      content: `
# Condicionales y Decisiones

## ¿Qué son las Condicionales?
Las condicionales nos permiten tomar decisiones en nuestros programas. Es como decir "si hay un obstáculo, entonces haz esto".

## Sintaxis de Condicionales
\`\`\`lua
-- Verificar si hay un obstáculo
if robot:hayObstaculo() then
  robot:saltarDerecha()
else
  robot:moverDerecha()
end
\`\`\`

## Ejercicio Práctico
Crea un programa que:
1. Verifique si hay obstáculos
2. Si hay obstáculo, salte
3. Si no hay obstáculo, avance

## Consejos
- Usa condicionales para manejar diferentes situaciones
- Piensa en todos los casos posibles
- Prueba tu código con diferentes escenarios

## ¡A practicar!
Ahora intenta resolver el nivel usando condicionales para manejar los obstáculos.
      `,
      levelId: 3,
      levelData:
        "0x0003010104040102000101010101010100010401010001040104000104040404",
      difficulty: "intermediate",
      order: 1,
    },
  ],
  advanced: [
    {
      id: "a1",
      title: "Optimización y Eficiencia",
      description:
        "Aprende técnicas avanzadas para hacer tus programas más eficientes.",
      videoUrl: "https://www.youtube.com/watch?v=hhmvicWxR9M",
      content: `
# Optimización y Eficiencia

## ¿Qué es la Optimización?
La optimización es hacer que nuestros programas sean más eficientes, usando menos comandos para lograr el mismo resultado.

## Técnicas de Optimización
1. **Uso de Variables**: Guardar valores que usamos frecuentemente
2. **Bucles Anidados**: Combinar diferentes tipos de bucles
3. **Condicionales Complejas**: Usar múltiples condiciones

## Ejemplo Avanzado
\`\`\`lua
-- Definir variables para el patrón
filas = 3
columnas = 4

-- Bucle anidado para crear un patrón
for f=1,filas do
  for c=1,columnas do
    robot:moverDerecha()
    robot:recolectar()
  end
  robot:moverArriba()
end
\`\`\`

## Ejercicio Práctico
Crea un programa optimizado que:
1. Use variables para definir el patrón
2. Implemente bucles anidados
3. Minimice el número de comandos

## Consejos
- Piensa en patrones en lugar de comandos individuales
- Usa variables para hacer tu código más flexible
- Busca formas de reducir la repetición

## ¡A practicar!
Ahora intenta resolver el nivel de la manera más eficiente posible.
      `,
      levelId: 4,
      levelData:
        "0x0003010104040102000101010101010100010401010001040104000104040404",
      difficulty: "advanced",
      order: 1,
    },
  ],
};

// Utility function to check if a lesson is unlocked
export const isLessonUnlocked = (lessonId: string): boolean => {
  if (typeof window === "undefined") return false;

  const unlockedLessons = JSON.parse(
    localStorage.getItem("unlockedLessons") || "[]",
  );
  return unlockedLessons.includes(lessonId);
};

// Utility function to unlock a lesson
export const unlockLesson = (lessonId: string): void => {
  if (typeof window === "undefined") return;

  const unlockedLessons = JSON.parse(
    localStorage.getItem("unlockedLessons") || "[]",
  );
  if (!unlockedLessons.includes(lessonId)) {
    unlockedLessons.push(lessonId);
    localStorage.setItem("unlockedLessons", JSON.stringify(unlockedLessons));
  }
};
