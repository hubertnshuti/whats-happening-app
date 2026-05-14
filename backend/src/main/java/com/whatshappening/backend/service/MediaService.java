package com.whatshappening.backend.service;

import com.whatshappening.backend.exception.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class MediaService {

    @Value("${app.upload.dir:${user.home}/whats-happening-uploads}")
    private String uploadDir;

    @Value("${app.upload.base-url:http://localhost:8084}")
    private String baseUrl;

    private static final List<String> ALLOWED_TYPES = List.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );
    private static final long MAX_BYTES = 10 * 1024 * 1024; // 10 MB

    public String uploadImage(MultipartFile file, String folder) {
        validate(file);
        try {
            Path dir = Paths.get(uploadDir, folder);
            Files.createDirectories(dir);

            String ext = getExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID() + "." + ext;
            Path dest = dir.resolve(filename);
            file.transferTo(dest.toFile());

            return baseUrl + "/uploads/" + folder + "/" + filename;
        } catch (IOException e) {
            log.error("File upload failed", e);
            throw new ApiException("Failed to upload file: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException("File is empty", HttpStatus.BAD_REQUEST);
        }
        if (file.getSize() > MAX_BYTES) {
            throw new ApiException("File exceeds 10 MB", HttpStatus.BAD_REQUEST);
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            throw new ApiException("Only JPG, PNG, WebP, and GIF images are allowed", HttpStatus.BAD_REQUEST);
        }
    }

    private String getExtension(String filename) {
        if (filename == null) return "jpg";
        int dot = filename.lastIndexOf('.');
        return dot >= 0 ? filename.substring(dot + 1).toLowerCase() : "jpg";
    }
}
