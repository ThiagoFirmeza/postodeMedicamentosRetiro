// O restante do seu código JS...

// 2. Funcionalidade dos Sliders (PILARES e FEEDBACK)
function setupSlider(trackId, prevBtnId, nextBtnId, dotsId, visibleItems = 3) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dotsContainer = document.getElementById(dotsId);
    const cards = Array.from(track.children);
    let currentIndex = 0;

    if (cards.length === 0) return;

    // Calcula o número total de páginas (grupos de slides)
    // O número de slides que você pode mover é o total de cards menos os visíveis.
    const maxIndex = cards.length - visibleItems;

    // Se o número de cards for menor ou igual ao número de itens visíveis, não precisa de slider
    if (maxIndex <= 0 && window.innerWidth > 768) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        dotsContainer.style.display = 'none';
        return;
    }


    // Cria os indicadores (dots)
    // Cria dots apenas para os movimentos possíveis (maxIndex + 1, pois começa em 0)
    for (let i = 0; i < cards.length; i++) {
        const dot = document.createElement('button');
        // O dot não move diretamente para o índice 'i', mas sim para a 'página' correspondente
        dot.addEventListener('click', () => {
            const targetIndex = Math.min(i, maxIndex);
            moveToSlide(targetIndex);
        });
        dotsContainer.appendChild(dot);
    }
    const dots = Array.from(dotsContainer.children);

    // Função para mover para o slide
    function moveToSlide(index) {
        // Garante que o índice não saia dos limites
        if (index < 0) {
            index = 0; // Para no início
        } else if (index > maxIndex) {
            index = maxIndex; // Para no final
        }
        currentIndex = index;

        // Cálculo da translação
        const cardWidth = cards[0].offsetWidth;
        const gap = 30; // Definido no CSS
        const moveDistance = currentIndex * (cardWidth + gap); // Move apenas um card por vez
        
        track.style.transform = `translateX(-${moveDistance}px)`;

        // Atualiza botões
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === maxIndex;
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex === maxIndex ? '0.5' : '1';

        // Atualiza os indicadores (dots)
        dots.forEach((dot, i) => {
            // O dot ativo é o que corresponde ao card atualmente em foco
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // Navegação por botões
    prevBtn.addEventListener('click', () => moveToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => moveToSlide(currentIndex + 1));

    // Ajuste no redimensionamento da janela (Responsividade)
    function handleResize() {
        if (window.innerWidth <= 768) {
            // Desativa/esconde o slider no mobile
            track.style.transform = 'translateX(0)';
            dotsContainer.style.display = 'none';
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            // Ativa/mostra o slider no desktop
            dotsContainer.style.display = 'block';
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
            // Garante que o slider esteja na posição correta ao redimensionar
            moveToSlide(currentIndex); 
        }
    }

    window.addEventListener('resize', handleResize);

    // Inicialização
    handleResize();
    if (window.innerWidth > 768) {
        moveToSlide(0);
    }
}

// Inicializa o slider de Serviços
setupSlider('pilar-track', 'pilar-prev', 'pilar-next', 'pilar-dots', 3);

// Inicializa o slider de Feedbacks
setupSlider('feedback-track', 'feedback-prev', 'feedback-next', 'feedback-dots', 3);