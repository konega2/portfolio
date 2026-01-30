<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

try {
    // Leer datos JSON
    $json_input = file_get_contents('php://input');
    $survey_data = json_decode($json_input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Datos JSON inválidos');
    }
    
    // Validar datos mínimos requeridos
    $required_fields = ['calificacion_general'];
    foreach ($required_fields as $field) {
        if (!isset($survey_data[$field])) {
            throw new Exception("Campo requerido faltante: $field");
        }
    }
    
    // Sanitizar y validar datos
    $clean_data = sanitizeSurveyData($survey_data);
    
    // Guardar en archivo JSON
    $surveys_file = 'encuestas.json';
    $surveys = [];
    
    // Cargar encuestas existentes
    if (file_exists($surveys_file)) {
        $existing_content = file_get_contents($surveys_file);
        if ($existing_content) {
            $surveys = json_decode($existing_content, true) ?: [];
        }
    }
    
    // Agregar nueva encuesta
    $surveys[] = $clean_data;
    
    // Guardar archivo
    $json_output = json_encode($surveys, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if (file_put_contents($surveys_file, $json_output) === false) {
        throw new Exception('Error al guardar la encuesta');
    }
    
    // Actualizar estadísticas
    updateSurveyStats($clean_data);
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Encuesta guardada correctamente',
        'survey_id' => $clean_data['id']
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

function sanitizeSurveyData($data) {
    $sanitized = [];
    // Campos de texto
    $text_fields = ['id', 'nombre', 'email', 'telefono', 'comentarios'];
    foreach ($text_fields as $field) {
        if (isset($data[$field])) {
            $sanitized[$field] = htmlspecialchars(trim($data[$field]), ENT_QUOTES, 'UTF-8');
        }
    }
    // Campos numéricos (calificaciones)
    $numeric_fields = ['calificacion_general', 'calidad_comida', 'calidad_servicio', 'ambiente', 'recomendacion'];
    foreach ($numeric_fields as $field) {
        if (isset($data[$field])) {
            $value = intval($data[$field]);
            if ($value >= 1 && $value <= 10) {
                $sanitized[$field] = $value;
            }
        }
    }
    // Campos de selección múltiple positivos
    $array_fields = ['aspecto_comida', 'aspecto_servicio', 'aspecto_ambiente'];
    foreach ($array_fields as $field) {
        if (isset($data[$field]) && is_array($data[$field])) {
            $sanitized[$field] = array_map(function($item) {
                return htmlspecialchars(trim($item), ENT_QUOTES, 'UTF-8');
            }, $data[$field]);
        }
    }
    // Campos de selección múltiple negativos
    $neg_array_fields = ['aspecto_comida_negativo', 'aspecto_servicio_negativo', 'aspecto_ambiente_negativo'];
    foreach ($neg_array_fields as $field) {
        if (isset($data[$field]) && is_array($data[$field])) {
            $sanitized[$field] = array_map(function($item) {
                return htmlspecialchars(trim($item), ENT_QUOTES, 'UTF-8');
            }, $data[$field]);
        }
    }
    // Campo de precio
    if (isset($data['relacion_precio'])) {
        $valid_prices = ['excelente', 'buena', 'regular', 'cara'];
        if (in_array($data['relacion_precio'], $valid_prices)) {
            $sanitized['relacion_precio'] = $data['relacion_precio'];
        }
    }
    // Campos booleanos
    if (isset($data['newsletter'])) {
        $sanitized['newsletter'] = (bool)$data['newsletter'];
    }
    // Campos de fecha y metadatos
    $sanitized['fecha_envio'] = date('Y-m-d H:i:s');
    $sanitized['ip_address'] = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $sanitized['user_agent'] = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    return $sanitized;
}

function updateSurveyStats($survey_data) {
    $stats_file = 'estadisticas_encuestas.json';
    $stats = [];
    
    // Cargar estadísticas existentes
    if (file_exists($stats_file)) {
        $existing_stats = file_get_contents($stats_file);
        if ($existing_stats) {
            $stats = json_decode($existing_stats, true) ?: [];
        }
    }
    
    // Inicializar estadísticas si no existen
    if (empty($stats)) {
        $stats = [
            'total_encuestas' => 0,
            'promedio_general' => 0,
            'promedio_comida' => 0,
            'promedio_servicio' => 0,
            'promedio_ambiente' => 0,
            'promedio_precio' => [],
            'promedio_recomendacion' => 0,
            'aspectos_comida' => [],
            'aspectos_servicio' => [],
            'aspectos_ambiente' => [],
            'comentarios_recientes' => [],
            'ultima_actualizacion' => date('Y-m-d H:i:s')
        ];
    }
    
    // Actualizar contadores
    $stats['total_encuestas']++;
    
    // Calcular promedios
    if (isset($survey_data['calificacion_general'])) {
        $stats['promedio_general'] = calculateNewAverage(
            $stats['promedio_general'], 
            $survey_data['calificacion_general'], 
            $stats['total_encuestas']
        );
    }
    
    if (isset($survey_data['calidad_comida'])) {
        $stats['promedio_comida'] = calculateNewAverage(
            $stats['promedio_comida'], 
            $survey_data['calidad_comida'], 
            $stats['total_encuestas']
        );
    }
    
    if (isset($survey_data['calidad_servicio'])) {
        $stats['promedio_servicio'] = calculateNewAverage(
            $stats['promedio_servicio'], 
            $survey_data['calidad_servicio'], 
            $stats['total_encuestas']
        );
    }
    
    if (isset($survey_data['ambiente'])) {
        $stats['promedio_ambiente'] = calculateNewAverage(
            $stats['promedio_ambiente'], 
            $survey_data['ambiente'], 
            $stats['total_encuestas']
        );
    }
    
    if (isset($survey_data['recomendacion'])) {
        $stats['promedio_recomendacion'] = calculateNewAverage(
            $stats['promedio_recomendacion'], 
            $survey_data['recomendacion'], 
            $stats['total_encuestas']
        );
    }
    
    // Actualizar aspectos destacados positivos
    if (isset($survey_data['aspecto_comida'])) {
        foreach ($survey_data['aspecto_comida'] as $aspecto) {
            $stats['aspectos_comida'][$aspecto] = ($stats['aspectos_comida'][$aspecto] ?? 0) + 1;
        }
    }
    if (isset($survey_data['aspecto_servicio'])) {
        foreach ($survey_data['aspecto_servicio'] as $aspecto) {
            $stats['aspectos_servicio'][$aspecto] = ($stats['aspectos_servicio'][$aspecto] ?? 0) + 1;
        }
    }
    if (isset($survey_data['aspecto_ambiente'])) {
        foreach ($survey_data['aspecto_ambiente'] as $aspecto) {
            $stats['aspectos_ambiente'][$aspecto] = ($stats['aspectos_ambiente'][$aspecto] ?? 0) + 1;
        }
    }
    // Actualizar aspectos negativos
    if (isset($survey_data['aspecto_comida_negativo'])) {
        foreach ($survey_data['aspecto_comida_negativo'] as $aspecto) {
            $stats['aspectos_comida_negativo'][$aspecto] = ($stats['aspectos_comida_negativo'][$aspecto] ?? 0) + 1;
        }
    }
    if (isset($survey_data['aspecto_servicio_negativo'])) {
        foreach ($survey_data['aspecto_servicio_negativo'] as $aspecto) {
            $stats['aspectos_servicio_negativo'][$aspecto] = ($stats['aspectos_servicio_negativo'][$aspecto] ?? 0) + 1;
        }
    }
    if (isset($survey_data['aspecto_ambiente_negativo'])) {
        foreach ($survey_data['aspecto_ambiente_negativo'] as $aspecto) {
            $stats['aspectos_ambiente_negativo'][$aspecto] = ($stats['aspectos_ambiente_negativo'][$aspecto] ?? 0) + 1;
        }
    }
    
    // Actualizar relación precio
    if (isset($survey_data['relacion_precio'])) {
        $precio = $survey_data['relacion_precio'];
        $stats['promedio_precio'][$precio] = ($stats['promedio_precio'][$precio] ?? 0) + 1;
    }
    
    // Agregar comentarios recientes (últimos 10), incluyendo sugerencias rápidas
    if (isset($survey_data['comentarios']) && !empty(trim($survey_data['comentarios']))) {
        array_unshift($stats['comentarios_recientes'], [
            'comentario' => $survey_data['comentarios'],
            'fecha' => date('Y-m-d H:i:s'),
            'calificacion_general' => $survey_data['calificacion_general'] ?? null
        ]);
    }
    // Mantener solo los últimos 10 comentarios
    $stats['comentarios_recientes'] = array_slice($stats['comentarios_recientes'], 0, 10);
    
    $stats['ultima_actualizacion'] = date('Y-m-d H:i:s');
    
    // Guardar estadísticas actualizadas
    file_put_contents($stats_file, json_encode($stats, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function calculateNewAverage($current_avg, $new_value, $total_count) {
    if ($total_count <= 1) {
        return $new_value;
    }
    
    $old_total = $current_avg * ($total_count - 1);
    return ($old_total + $new_value) / $total_count;
}
?>
