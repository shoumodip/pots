window.onload = async () => {
  document.fonts.add(await new FontFace("November", "url(november.ttf)").load())

  const app = document.getElementById("app")
  const ctx = app.getContext("2d")
  const game = {
    x: 0,
    y: 0,
    cols: 0,
    rows: 0,
    size: 0,
    list: [],

    life: 5,
    score: 0,

    heal: 0,
    spawn: 0,
    first: true
  }

  window.onresize = () => {
    app.width = window.innerWidth
    app.height = window.innerHeight

    game.size = Math.max(app.width / 8, app.height * 0.9 / 8)
    game.cols = Math.floor(app.width / game.size)
    game.rows = Math.floor(app.height / game.size)

    game.x = (app.width - game.cols * game.size) / 2
    game.y = (app.height * 1.1 - game.rows * game.size) / 2

    if (game.list.length < game.rows) {
      for (const row of game.list) {
        for (let i = row.length; i < game.cols; i++) {
          row.push(0)
        }
      }

      for (let i = game.list.length; i < game.rows; i++) {
        game.list.push(Array(game.cols).fill(0))
      }
    } else {
      game.list.length = game.rows
    }
  }
  window.onresize()

  window.onclick = (e) => {
    if (game.first) {
      game.first = false
      return
    }

    if (game.life <= 0) {
      game.life = 5
      game.score = 0

      game.heal = 0
      game.spawn = 0

      for (const row of game.list) {
        row.fill(0)
      }
    }

    const mx = e.offsetX - game.x
    const my = e.offsetY - game.y

    const bx = Math.floor(mx / game.size)
    const by = Math.floor(my / game.size)

    const dx = mx - (bx + 0.5) * game.size
    const dy = my - (by + 0.5) * game.size

    if (bx < 0 || bx >= game.cols || by < 0 || by >= game.rows) {
      return
    }

    if (Math.pow(dx, 2) + Math.pow(dy, 2) >= Math.pow(game.size * 0.3, 2)) {
      return
    }

    if (game.list[by][bx] > 0) {
      game.score++
      game.list[by][bx] = 0
    }
  }

  function drawCircle(x, y, r, c) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.closePath()

    ctx.fillStyle = c
    ctx.fill()
  }

  function drawPot(x, y, r) {
    drawCircle(x, y + r * 0.25, r * 0.7, "#e78a4e")
    ctx.fillRect(x - r * 0.4, y - r * 0.6, r * 0.8, r)
  }

  function gameUpdate() {
    ctx.fillStyle = "#282828"
    ctx.fillRect(0, 0, app.width, app.height)

    if (game.first) {
      ctx.font = app.height * 0.05 + "px November"
      ctx.textAlign = "center"
      ctx.fillStyle = "#d4be98"
      ctx.fillText("Pot Smash", app.width * 0.5, app.height * 0.5)

      ctx.font = app.height * 0.03 + "px November"
      ctx.fillText("(Click to start)", app.width * 0.5, app.height * 0.55)
    } else if (game.life <= 0) {
      ctx.font = app.height * 0.05 + "px November"
      ctx.textAlign = "center"
      ctx.fillStyle = "#d4be98"
      ctx.fillText("Game Over", app.width * 0.5, app.height * 0.5)

      ctx.font = app.height * 0.03 + "px November"
      ctx.fillText("(Click to restart)", app.width * 0.5, app.height * 0.55)
    } else {
      game.heal += 0.016
      if (game.heal >= 30) {
        if (game.life < 5) {
          game.life++
        }
        game.heal = 0
      }

      game.spawn += 0.016
      if (game.spawn >= 0.7) {
        const x = Math.floor(Math.random() * game.cols)
        const y = Math.floor(Math.random() * game.rows)

        game.spawn = 0
        game.list[y][x] = 1 + Math.random()
      }

      ctx.fillStyle = "#32302f"
      ctx.fillRect(0, 0, app.width, app.height * 0.1)

      ctx.font = app.height * 0.07 + "px November"
      ctx.textAlign = "left"
      ctx.fillStyle = "#d4be98"
      ctx.fillText(game.score, app.width * 0.02, app.height * 0.08)

      for (let i = 0; i < game.life; i++) {
        drawPot(app.width - (0.5 + i) * app.height * 0.06, app.height * 0.045, app.height * 0.03)
      }

      for (let x = 0; x < game.cols; x++) {
        for (let y = 0; y < game.rows; y++) {
          drawCircle(
            game.x + (x + 0.5) * game.size,
            game.y + (y + 0.5) * game.size,
            game.size * 0.3,
            "#1d2021")

          if (game.list[y][x] > 0) {
            game.list[y][x] -= 0.016
            if (game.list[y][x] > 0) {
              drawPot(
                game.x + (x + 0.5) * game.size,
                game.y + (y + 0.5) * game.size,
                game.size * 0.3)
            } else {
              game.life--
            }
          }
        }
      }
    }
    window.requestAnimationFrame(gameUpdate)
  }
  window.requestAnimationFrame(gameUpdate)
}
