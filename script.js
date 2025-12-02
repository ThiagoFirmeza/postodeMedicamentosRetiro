// O restante do seu código JS...

// 2. Funcionalidade dos Sliders (PILARES e FEEDBACK)
/**
 * Configura um carrossel responsivo.
 * @param {string} trackId - O ID do elemento que contém os slides (track).
 * @param {string} prevBtnId - O ID do botão de navegação anterior.
 * @param {string} nextBtnId - O ID do botão de navegação próximo.
 * @param {string} dotsId - O ID do contêiner dos indicadores (dots).
 * @param {number} initialVisibleItems - O número de itens visíveis no desktop.
 */
function setupSlider(trackId, prevBtnId, nextBtnId, dotsId, initialVisibleItems = 3) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dotsContainer = document.getElementById(dotsId);
    const cards = Array.from(track.children);
    let currentIndex = 0;
    let maxIndex = 0;
    let visibleItems = initialVisibleItems;

    if (cards.length === 0) return;

    // --- Funções Auxiliares ---

    // Função para (re)criar/atualizar os indicadores (dots)
    function updateDots() {
        dotsContainer.innerHTML = ''; // Limpa os dots existentes
        
        // Cria um dot para cada movimento possível (até o maxIndex)
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => {
                moveToSlide(i);
            });
            dotsContainer.appendChild(dot);
        }
    }

    // Função para mover para o slide
    function moveToSlide(index) {
        // Garante que o índice não saia dos limites
        if (index < 0) {
            index = 0;
        } else if (index > maxIndex) {
            index = maxIndex;
        }
        currentIndex = index;

        // Cálculo da translação
        // Certifique-se de que os cards existam antes de tentar acessar offsetWidth
        const cardWidth = cards.length > 0 ? cards[0].offsetWidth : 0;
        const gap = 30; // Definido no CSS
        
        // Distância de movimento: (Índice do card) * (Largura do Card + Gap)
        const moveDistance = currentIndex * (cardWidth + gap); 
        
        track.style.transform = `translateX(-${moveDistance}px)`;

        // Atualiza botões
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === maxIndex;
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex === maxIndex ? '0.5' : '1';

        // Atualiza os indicadores (dots)
        const dots = Array.from(dotsContainer.children);
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // --- Navegação e Responsividade ---

    // Navegação por botões
    prevBtn.addEventListener('click', () => moveToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => moveToSlide(currentIndex + 1));

    // Ajuste no redimensionamento da janela (Responsividade)
    function handleResize() {
        // 1. Redefine o número de itens visíveis (Desktop vs Mobile)
        const isMobile = window.innerWidth <= 768;
        // 1 item visível no mobile, e o valor inicial no desktop
        visibleItems = isMobile ? 1 : initialVisibleItems; 

        // 2. Recalcula o maxIndex (Número de movimentos possíveis)
        // maxIndex é o número total de cards menos o número de cards visíveis
        maxIndex = Math.max(0, cards.length - visibleItems);

        // 3. Controla a visibilidade e o comportamento
        if (cards.length <= visibleItems) {
            // Se não precisa de carrossel, desativa/esconde tudo
            dotsContainer.style.display = 'none';
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            track.style.transform = 'translateX(0)';
            return;
        } else {
            // Se precisa de carrossel, exibe os elementos de navegação
            // Note: Use 'flex' ou 'block' dependendo de como você estilizou os dots
            dotsContainer.style.display = 'flex'; 
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        }

        // 4. Atualiza os dots e a posição do slide
        updateDots();
        // Garante que o currentIndex não seja maior que o novo maxIndex
        currentIndex = Math.min(currentIndex, maxIndex);
        moveToSlide(currentIndex); 
    }

    window.addEventListener('resize', handleResize);

    // --- Inicialização ---
    
    // Inicializa a responsividade e calcula os valores iniciais
    handleResize(); 
    // Garante que o carrossel comece na primeira posição
    moveToSlide(0); 
}

// Inicializa o slider de Serviços (PILARES)
setupSlider('pilar-track', 'pilar-prev', 'pilar-next', 'pilar-dots', 3);

// Inicializa o slider de Feedbacks
setupSlider('feedback-track', 'feedback-prev', 'feedback-next', 'feedback-dots', 3);
