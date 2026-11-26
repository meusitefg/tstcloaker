export const EXU_PROTECTED_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>⚠ PROTEGIDO POR EXU ⚠</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #0a0a0a;
            color: #ff0000;
            font-family: 'Courier New', Courier, monospace;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            overflow-x: hidden;
            position: relative;
            cursor: default;
        }

        body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(ellipse at center, rgba(80, 0, 0, 0.4) 0%, transparent 70%),
                repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(255, 0, 0, 0.03) 2px,
                    rgba(255, 0, 0, 0.03) 4px
                );
            pointer-events: none;
            z-index: 0;
        }

        .container {
            position: relative;
            z-index: 1;
            max-width: 800px;
            padding: 40px 30px;
            border: 3px solid #8b0000;
            background: rgba(20, 0, 0, 0.9);
            box-shadow: 
                0 0 30px rgba(255, 0, 0, 0.5),
                inset 0 0 40px rgba(139, 0, 0, 0.3);
            animation: pulse-border 2s ease-in-out infinite;
        }

        @keyframes pulse-border {
            0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.4), inset 0 0 30px rgba(139, 0, 0, 0.2); }
            50% { box-shadow: 0 0 40px rgba(255, 0, 0, 0.7), inset 0 0 50px rgba(139, 0, 0, 0.4); }
        }

        .skull {
            font-size: 80px;
            margin-bottom: 20px;
            animation: glow 1.5s ease-in-out infinite alternate;
            text-shadow: 0 0 20px #ff0000, 0 0 40px #8b0000;
        }

        @keyframes glow {
            from { text-shadow: 0 0 10px #ff0000, 0 0 20px #8b0000; }
            to { text-shadow: 0 0 30px #ff0000, 0 0 60px #ff4500, 0 0 80px #8b0000; }
        }

        h1 {
            font-size: 2.2rem;
            letter-spacing: 4px;
            margin-bottom: 25px;
            text-transform: uppercase;
            color: #ff2222;
            text-shadow: 0 0 10px #ff0000;
        }

        .warning {
            font-size: 1.3rem;
            line-height: 1.8;
            margin-bottom: 25px;
            color: #ffaaaa;
        }

        .warning strong {
            color: #ff0000;
            font-size: 1.5rem;
            display: block;
            margin: 15px 0;
            text-shadow: 0 0 8px #ff0000;
        }

        .exu {
            font-size: 1.1rem;
            color: #ffcc00;
            margin: 25px 0;
            padding: 15px;
            border-top: 1px solid #8b0000;
            border-bottom: 1px solid #8b0000;
            letter-spacing: 2px;
        }

        .curse {
            font-size: 1.15rem;
            color: #ff6666;
            margin-top: 20px;
            line-height: 1.7;
        }

        .footer {
            margin-top: 35px;
            font-size: 0.85rem;
            color: #aa4444;
            letter-spacing: 3px;
            text-transform: uppercase;
        }

        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #ff0000;
            border-radius: 50%;
            opacity: 0.6;
            animation: float 6s infinite ease-in-out;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
            50% { transform: translateY(-40px) scale(1.5); opacity: 0.9; }
        }

        @media (max-width: 600px) {
            h1 { font-size: 1.5rem; }
            .warning { font-size: 1.1rem; }
            .skull { font-size: 60px; }
            .container { margin: 20px; padding: 25px 15px; }
        }
    </style>
</head>
<body>
    <div class="particle" style="top: 20%; left: 15%; animation-delay: 0s;"></div>
    <div class="particle" style="top: 60%; left: 80%; animation-delay: 1.5s;"></div>
    <div class="particle" style="top: 40%; left: 10%; animation-delay: 3s;"></div>
    <div class="particle" style="top: 80%; left: 70%; animation-delay: 2s;"></div>
    <div class="particle" style="top: 15%; left: 85%; animation-delay: 4s;"></div>

    <div class="container">
        <div class="skull">☠</div>
        
        <h1>Site Protegido</h1>
        
        <div class="warning">
            Este domínio está sob a proteção da<br>
            <strong>ENTIDADE DE EXU</strong>
        </div>

        <div class="exu">
            ✦ LAROYÊ EXU ✦<br>
            Dono da encruzilhada • Guardião dos caminhos
        </div>

        <div class="curse">
            <p>Se você não for o dono legítimo deste site<br>
            e tentar cloná-lo ou roubá-lo...</p>
            
            <p style="margin-top: 20px; color: #ff3333; font-weight: bold;">
                SERÁ AMALDIÇOADO<br>
                pelos Deuses Anti-Clonadores
            </p>
            
            <p style="margin-top: 25px; font-size: 1rem;">
                Que Exu feche seus caminhos,<br>
                confunda sua mente<br>
                e queime suas intenções malignas.
            </p>
        </div>

        <div class="footer">
            ⚠ Saia agora ou enfrente as consequências ⚠
        </div>
    </div>

</body>
</html>`;
