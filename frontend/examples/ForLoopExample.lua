-- Area de codigo para programar el robot
robot = Robot.new()

-- Inicializar el robot
robot:encender()
robot:moverIzquierda()

for i=1,2 do
  robot:moverArriba()
  robot:recolectar()
end

robot:moverDerecha()
robot:recolectar()
robot:moverDerecha()

-- class definition
--------------------------------    
--------------------------------
--------------------------------
-- El resto del código del robot 