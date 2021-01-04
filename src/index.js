class Simulation {
    init(opts){
      this.width = opts && opts.width ? opts.width : innerWidth;
      this.height = opts && opts.height ? opts.height : innerHeight;
      this.center = [this.width / 2, this.height / 2];
      this.data = [];
      
      return this;
    }
    
    add(datum){
      const d = datum || {};
      d.pos = d.pos || this.center;
      d.radius = d.radius || 5;
      d.angle = d.angle || 0;
      d.speed = d.speed || 1;
      d.colour = d.colour || 0;
      
      this.data.push(d);
      
      return this;
    }
    
    tick(){
      // Loop through the data
      for (let i = 0; i < this.data.length; i++){
        const d = this.data[i];
        d.collided = false;

        // Detect collisions
        for (let i0 = 0; i0 < this.data.length; i0++){
          const d0 = this.data[i0];
          d0.collided = false;

          // Collision!
          if (i !== i0 && geometric.lineLength([d.pos, d0.pos]) < d.radius + d0.radius && !d.collided && !d0.collided){
            
            // To avoid having them stick to each other,
            // test if moving them in each other's angles will bring them closer or farther apart
            const keep = geometric.lineLength([
                    geometric.pointTranslate(d.pos, d.angle, d.speed),
                    geometric.pointTranslate(d0.pos, d0.angle, d0.speed)
                  ]),
                  swap = geometric.lineLength([
                    geometric.pointTranslate(d.pos, d0.angle, d0.speed),
                    geometric.pointTranslate(d0.pos, d.angle, d.speed)
                  ]);

            if (keep < swap) {
              const dc = JSON.parse(JSON.stringify(d));

              d.angle = d0.angle;
              d.speed = d0.speed;
              d0.angle = dc.angle;
              d0.speed = dc.speed;
              
              d.collided = true;
              d0.collided = true;
            }

            break;
          }
        }

        // Detect sides
        const wallVertical = d.pos[0] <= d.radius || d.pos[0] >= this.width - d.radius,
              wallHorizontal = d.pos[1] <= d.radius || d.pos[1] >= this.height - d.radius;

        if (wallVertical || wallHorizontal){

          // Is it moving more towards the middle or away from it?
          const t0 = geometric.pointTranslate(d.pos, d.angle, d.speed);
          const l0 = geometric.lineLength([this.center, t0]);

          const reflected = geometric.angleReflect(d.angle, wallVertical ? 90 : 0);
          const t1 = geometric.pointTranslate(d.pos, reflected, d.speed);
          const l1 = geometric.lineLength([this.center, t1]);

          if (l1 < l0) d.angle = reflected;
        }

        d.pos = geometric.pointTranslate(d.pos, d.angle, d.speed);
      }
    }
  }

  // Initiate a simulation
  const mySimulation = (_ => {
    const simulation = new Simulation;
    
    // Initialize this simulation with simulation.init
    // You can pass an optional configuration object to init with the properties:
    //   - width
    //   - height
    simulation.init();
    
    // We'll create 100 circles of random radii, moving in random directions at random speeds.
    for (let i = 0; i < 50; i++){
      const radius = d3.randomUniform(4, 6)();
      
      // Add a circle to your simulation with simulation.add
      simulation.add({
        colour: d3.randomInt(0, 10)(),
        speed: d3.randomUniform(1.5, 3.5)(),
        angle: d3.randomUniform(0, 360)(),
        pos: [
          d3.randomUniform(radius, simulation.width - radius)(),
          d3.randomUniform(radius, simulation.height - radius)()
        ],
        radius
      });
    }
    
    return simulation;
  })();

  // Draw the simulation
  const wrapper = document.getElementById("simulation");
  const canvas = document.createElement("canvas");

  canvas.width = mySimulation.width;
  canvas.height = mySimulation.height;

  canvas.style.background = "#353839"; 
  wrapper.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const colourValues = ['#EE3123', '#F57F2A', '#FFF001', '#59B947', '#0054A7', '#A0238F', '#000000', '#613917', '#7CC1E9', '#F398C0', '#FFFFFF'];

  function tick(){
    requestAnimationFrame(tick);
    ctx.clearRect(0, 0, mySimulation.width, mySimulation.height);

    // The simulation.tick method advances the simulation one tick
    mySimulation.tick();
    for (let i = 0, l = mySimulation.data.length; i < l; i++){
      const d = mySimulation.data[i];
      console.log(d.colour)
      ctx.beginPath();
      ctx.arc(...d.pos, d.radius, 0, 2 * Math.PI);
      ctx.fillStyle = colourValues[d.colour];
      ctx.fill();
    }
  }
  tick();