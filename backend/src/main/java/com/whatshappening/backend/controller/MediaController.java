package com.whatshappening.backend.controller;

import com.whatshappening.backend.dto.common.ApiResponse;
import com.whatshappening.backend.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    private static final Set<String> ALLOWED_PURPOSES = Set.of(
            "event-covers", "event-gallery", "user-avatars"
    );

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "purpose", defaultValue = "event-covers") String purpose) {

        if (!ALLOWED_PURPOSES.contains(purpose)) {
            purpose = "event-covers";
        }

        String url = mediaService.uploadImage(file, purpose);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Upload successful", Map.of("url", url)));
    }
}