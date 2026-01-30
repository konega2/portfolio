<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultados de Encuestas - La Visteta</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            min-height: 100vh;
        }
        
        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 2rem 0;
            margin-bottom: 2rem;
        }
        
        .stats-card {
            background: white;
            border-radius: 15px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .stats-card:hover {
            transform: translateY(-5px);
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        
        .star-display {
            color: #ffc107;
            font-size: 1.2rem;
        }
        
        .rating-bar {
            height: 10px;
            background: #e9ecef;
            border-radius: 5px;
            overflow: hidden;
            margin: 0.5rem 0;
        }
        
        .rating-fill {
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            transition: width 1s ease;
        }
        
        .comment-card {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 0 8px 8px 0;
        }
        
        .aspect-tag {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
            font-size: 0.8rem;
            margin: 0.2rem;
            display: inline-block;
        }
        
        .chart-container {
            position: relative;
            height: 300px;
            margin: 1rem 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <h1><i class="fas fa-chart-bar"></i> Resultados de Encuestas</h1>
                    <p class="mb-0">Panel de análisis de satisfacción del cliente</p>
                </div>
                <div class="col-md-6 text-end">
                    <a href="../gestion/index.php" class="btn btn-light">
                        <i class="fas fa-arrow-left"></i> Volver al Panel
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <?php
        // Cargar estadísticas
        $stats_file = 'estadisticas_encuestas.json';
        $stats = [];
        
        if (file_exists($stats_file)) {
            $stats_content = file_get_contents($stats_file);
            if ($stats_content) {
                $stats = json_decode($stats_content, true) ?: [];
            }
        }
        
        if (empty($stats)): ?>
            <div class="alert alert-info text-center">
                <i class="fas fa-info-circle fa-2x mb-3"></i>
                <h4>No hay encuestas disponibles</h4>
                <p>Aún no se han recibido respuestas de encuestas de satisfacción.</p>
                <a href="index.html" class="btn btn-primary">
                    <i class="fas fa-external-link-alt"></i> Ver Encuesta
                </a>
            </div>
        <?php else: ?>
            
        <!-- Resumen General -->
        <div class="row mb-4">
            <div class="col-md-12">
                <h3 class="mb-3"><i class="fas fa-clipboard-data"></i> Resumen General</h3>
            </div>
            <div class="col-md-3">
                <div class="stats-card text-center">
                    <div class="stat-number text-primary"><?php echo $stats['total_encuestas']; ?></div>
                    <div class="text-muted">Total Encuestas</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card text-center">
                    <div class="stat-number text-warning">
                        <?php echo number_format($stats['promedio_general'] ?? 0, 1); ?>
                        <span class="star-display">★</span>
                    </div>
                    <div class="text-muted">Calificación Promedio</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card text-center">
                    <div class="stat-number text-success">
                        <?php echo number_format($stats['promedio_recomendacion'] ?? 0, 1); ?>/10
                    </div>
                    <div class="text-muted">Índice de Recomendación</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card text-center">
                    <div class="stat-number text-info">
                        <?php 
                        $nps = calcularNPS($stats['promedio_recomendacion'] ?? 0);
                        echo $nps;
                        ?>
                    </div>
                    <div class="text-muted">NPS Score</div>
                </div>
            </div>
        </div>

        <!-- Calificaciones Detalladas -->
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="stats-card">
                    <h5><i class="fas fa-star"></i> Calificaciones por Categoría</h5>
                    
                    <div class="mb-3">
                        <div class="d-flex justify-content-between">
                            <span>Calidad de la Comida</span>
                            <span><?php echo number_format($stats['promedio_comida'] ?? 0, 1); ?>/5</span>
                        </div>
                        <div class="rating-bar">
                            <div class="rating-fill" style="width: <?php echo (($stats['promedio_comida'] ?? 0) / 5) * 100; ?>%"></div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <div class="d-flex justify-content-between">
                            <span>Calidad del Servicio</span>
                            <span><?php echo number_format($stats['promedio_servicio'] ?? 0, 1); ?>/5</span>
                        </div>
                        <div class="rating-bar">
                            <div class="rating-fill" style="width: <?php echo (($stats['promedio_servicio'] ?? 0) / 5) * 100; ?>%"></div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <div class="d-flex justify-content-between">
                            <span>Ambiente</span>
                            <span><?php echo number_format($stats['promedio_ambiente'] ?? 0, 1); ?>/5</span>
                        </div>
                        <div class="rating-bar">
                            <div class="rating-fill" style="width: <?php echo (($stats['promedio_ambiente'] ?? 0) / 5) * 100; ?>%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="stats-card">
                    <h5><i class="fas fa-euro-sign"></i> Percepción de Precios</h5>
                    <?php if (!empty($stats['promedio_precio'])): ?>
                        <?php 
                        $precio_labels = [
                            'excelente' => 'Excelente relación',
                            'buena' => 'Buena relación',
                            'regular' => 'Regular',
                            'cara' => 'Caro'
                        ];
                        $total_precio = array_sum($stats['promedio_precio']);
                        ?>
                        <?php foreach ($stats['promedio_precio'] as $precio => $cantidad): ?>
                            <div class="mb-3">
                                <div class="d-flex justify-content-between">
                                    <span><?php echo $precio_labels[$precio] ?? $precio; ?></span>
                                    <span><?php echo $cantidad; ?> (<?php echo round(($cantidad / $total_precio) * 100, 1); ?>%)</span>
                                </div>
                                <div class="rating-bar">
                                    <div class="rating-fill" style="width: <?php echo ($cantidad / $total_precio) * 100; ?>%"></div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p class="text-muted">No hay datos de percepción de precios disponibles.</p>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Aspectos Destacados -->
        <div class="row mb-4">
            <div class="col-md-4">
                <div class="stats-card">
                    <h5><i class="fas fa-utensils"></i> Aspectos de la Comida</h5>
                    <?php if (!empty($stats['aspectos_comida'])): ?>
                        <?php arsort($stats['aspectos_comida']); ?>
                        <?php foreach ($stats['aspectos_comida'] as $aspecto => $cantidad): ?>
                            <span class="aspect-tag"><?php echo ucfirst(str_replace('_', ' ', $aspecto)); ?> (<?php echo $cantidad; ?>)</span>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p class="text-muted">No hay datos disponibles.</p>
                    <?php endif; ?>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="stats-card">
                    <h5><i class="fas fa-concierge-bell"></i> Aspectos del Servicio</h5>
                    <?php if (!empty($stats['aspectos_servicio'])): ?>
                        <?php arsort($stats['aspectos_servicio']); ?>
                        <?php foreach ($stats['aspectos_servicio'] as $aspecto => $cantidad): ?>
                            <span class="aspect-tag"><?php echo ucfirst(str_replace('_', ' ', $aspecto)); ?> (<?php echo $cantidad; ?>)</span>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p class="text-muted">No hay datos disponibles.</p>
                    <?php endif; ?>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="stats-card">
                    <h5><i class="fas fa-home"></i> Aspectos del Ambiente</h5>
                    <?php if (!empty($stats['aspectos_ambiente'])): ?>
                        <?php arsort($stats['aspectos_ambiente']); ?>
                        <?php foreach ($stats['aspectos_ambiente'] as $aspecto => $cantidad): ?>
                            <span class="aspect-tag"><?php echo ucfirst(str_replace('_', ' ', $aspecto)); ?> (<?php echo $cantidad; ?>)</span>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p class="text-muted">No hay datos disponibles.</p>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Comentarios Recientes -->
        <div class="row">
            <div class="col-md-12">
                <div class="stats-card">
                    <h5><i class="fas fa-comments"></i> Comentarios Recientes</h5>
                    <?php if (!empty($stats['comentarios_recientes'])): ?>
                        <?php foreach ($stats['comentarios_recientes'] as $comentario): ?>
                            <div class="comment-card">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <div class="star-display">
                                        <?php for ($i = 1; $i <= 5; $i++): ?>
                                            <i class="fas fa-star <?php echo $i <= ($comentario['calificacion_general'] ?? 0) ? '' : 'text-muted'; ?>"></i>
                                        <?php endfor; ?>
                                    </div>
                                    <small class="text-muted"><?php echo date('d/m/Y H:i', strtotime($comentario['fecha'])); ?></small>
                                </div>
                                <p class="mb-0"><?php echo htmlspecialchars($comentario['comentario']); ?></p>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p class="text-muted">No hay comentarios disponibles.</p>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Información Adicional -->
        <div class="row mt-4">
            <div class="col-md-12">
                <div class="stats-card text-center">
                    <h6>Última Actualización</h6>
                    <p class="text-muted mb-0">
                        <?php echo date('d/m/Y H:i:s', strtotime($stats['ultima_actualizacion'] ?? 'now')); ?>
                    </p>
                    <div class="mt-3">
                        <a href="exportar_encuestas.php" class="btn btn-primary me-2">
                            <i class="fas fa-download"></i> Exportar Datos
                        </a>
                        <a href="index.html" class="btn btn-outline-secondary">
                            <i class="fas fa-external-link-alt"></i> Ver Encuesta
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <?php endif; ?>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Animación de las barras de progreso
        document.addEventListener('DOMContentLoaded', function() {
            const ratingFills = document.querySelectorAll('.rating-fill');
            ratingFills.forEach((fill, index) => {
                const width = fill.style.width;
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.width = width;
                }, 200 + (index * 100));
            });
        });
    </script>
</body>
</html>

<?php
function calcularNPS($promedio_recomendacion) {
    // NPS simplificado basado en el promedio de recomendación
    if ($promedio_recomendacion >= 9) {
        return "Excelente";
    } elseif ($promedio_recomendacion >= 7) {
        return "Bueno";
    } elseif ($promedio_recomendacion >= 5) {
        return "Regular";
    } else {
        return "Mejorar";
    }
}
?>
