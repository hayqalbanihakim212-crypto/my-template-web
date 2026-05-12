use std::fs;

/// Fungsi untuk menelan log dari tools eksternal (Nuclei, Nmap, dll)
pub async fn analyze_bug_bounty_logs(
    engine: &mut QalopiAIEngine,
    tokenizer: &crate::improved_tokenizer::ImprovedTokenizer,
    log_path: &str,
    target_domain: &str
) -> anyhow::Result<String> {
    
    // 1. Baca hasil log murni
    let raw_logs = fs::read_to_string(log_path)
        .unwrap_or_else(|_| String::from("Gagal membaca file log."));

    // 2. Susun prompt untuk RAG (Retrieval-Augmented Generation)
    // Di sinilah kecerdasan QALOPI diuji
    let system_prompt = format!(
        "<|system|>\nKamu adalah QALOPI, Analis Keamanan Siber tingkat lanjut. \n\
        Tugasmu adalah menganalisis raw log dari tools scanner (Nuclei/Nmap) berikut untuk target {}.\n\
        1. Singkirkan semua informasi sampah (False Positives).\n\
        2. Identifikasi kerentanan paling kritis.\n\
        3. Berikan 'Proof of Concept' (Langkah eksploitasi spesifik) untuk dilaporkan ke Bug Bounty.\n\
        <|user|>\nRAW LOGS:\n{}\n<|assistant|>\n",
        target_domain, raw_logs
    );

    // 3. Eksekusi inferensi AI secara lokal (Tanpa butuh internet/OpenAI)
    println!("{}[*] QALOPI AI sedang membedah ribuan baris log...{}", crate::command::BRIGHT_BLUE, crate::command::RESET);
    
    let analysis_result = engine.generate_tactic(
        tokenizer,
        &system_prompt,
        "Bug Bounty Mode", // Konteks dummy
        1024, // Butuh output yang lebih panjang untuk laporan
        0.3   // Suhu rendah (0.3) agar AI sangat analitis dan tidak berhalusinasi
    )?;

    Ok(analysis_result)
}


(main.rs)
// Contoh implementasi di dalam loop pembacaan terminal C2:
let input = input_raw.trim();

if input.starts_with("/analyze ") {
    // Format yang diharapkan: /analyze [target_domain] [path_file_log]
    // Contoh: /analyze www.tokopedia.com C:\logs\nuclei_result.txt
    
    let parts: Vec<&str> = input.split_whitespace().collect();
    if parts.len() >= 3 {
        let target_domain = parts[1];
        let log_path = parts[2];
        
        println!("{}[*] Menginisiasi QALOPI AI Log Analyzer untuk {}...{}", crate::command::BRIGHT_BLUE, target_domain, crate::command::RESET);
        
        // Asumsi kamu memiliki variabel 'engine' dan 'tokenizer' yang sudah diinisialisasi 
        // di memori C2 Server-mu (mirip dengan saat kamu memanggil RAG sebelumnya)
        // Note: Karena fungsinya async, kita harus membungkusnya dalam eksekusi tokio
        
        // let mut ai_engine = ...; // Ambil instance engine-mu
        // let tokenizer = ...;     // Ambil instance tokenizer-mu

        match crate::ai_engine::analyze_bug_bounty_logs(&mut ai_engine, &tokenizer, log_path, target_domain).await {
            Ok(report) => {
                println!("{}[+] === LAPORAN BUG BOUNTY QALOPI ==={}", crate::command::DARK_RED, crate::command::RESET);
                println!("{}", report);
                println!("{}[+] ================================={}", crate::command::DARK_RED, crate::command::RESET);
            },
            Err(e) => eprintln!("[!] AI Gagal Menganalisis Log: {}", e),
        }
    } else {
        eprintln!("[!] Format salah. Gunakan: /analyze <domain> <path_file_log>");
    }
    continue; // Kembali ke loop terminal
}


command.rs
println!("[*] /analyze <domain> <file> -> Suruh AI menganalisis log Bug Bounty lokal");
