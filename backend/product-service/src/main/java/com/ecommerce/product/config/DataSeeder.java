package com.ecommerce.product.config;

import com.ecommerce.common.enums.ProductStatus;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            log.info("Seeding initial product data to PostgreSQL...");

            List<Product> products = new ArrayList<>();
            products.add(buildProduct("Creed Aventus", "Creed", "Niche", "Hương thơm biểu tượng dành cho nam giới", new BigDecimal("7500000"), "MEN", "EDP", "/images/creed-aventus.png"));
            products.add(buildProduct("Baccarat Rouge 540", "MFK", "Niche", "Tuyệt tác hương thơm ngọt ngào", new BigDecimal("9200000"), "UNISEX", "EDP", "/images/baccarat-rouge-540.jpg"));
            products.add(buildProduct("Le Labo Santal 33", "Le Labo", "Niche", "Hương gỗ đàn hương kinh điển", new BigDecimal("6800000"), "UNISEX", "EDP", "/images/le-labo-santal-33.png"));
            products.add(buildProduct("Tom Ford Oud Wood", "Tom Ford", "Designer", "Trầm hương và bạch đậu khấu", new BigDecimal("8100000"), "UNISEX", "EDP", "/images/tom-ford-oud-wood.jpg"));
            products.add(buildProduct("Dior Sauvage", "Dior", "Designer", "Hương thơm phóng khoáng", new BigDecimal("3200000"), "MEN", "EDP", "/images/dior-sauvage.jpg"));
            products.add(buildProduct("Chanel No5", "Chanel", "Designer", "Nước hoa huyền thoại", new BigDecimal("4500000"), "WOMEN", "EDP", "/images/chanel-no5.jpg"));
            products.add(buildProduct("Xerjoff Naxos", "Xerjoff", "Niche", "Hòa quyện mật ong, hoa cam", new BigDecimal("11000000"), "MEN", "EDP", "/images/xerjoff-naxos.jpg"));
            products.add(buildProduct("Amouage Interlude", "Amouage", "Niche", "Hương trầm hương bí ẩn", new BigDecimal("8800000"), "MEN", "EDP", "/images/amouage-interlude.jpg"));
            products.add(buildProduct("Bleu de Chanel", "Chanel", "Designer", "Nam tính, mạnh mẽ", new BigDecimal("3500000"), "MEN", "EDP", "/images/bleu-de-chanel.jpg"));
            products.add(buildProduct("Acqua di Gio Profumo", "Giorgio Armani", "Designer", "Hương biển sảng khoái", new BigDecimal("3000000"), "MEN", "Parfum", "/images/acqua-di-gio-profumo.jpg"));
            products.add(buildProduct("YSL Y EDP", "Yves Saint Laurent", "Designer", "Hiện đại, cuốn hút", new BigDecimal("3100000"), "MEN", "EDP", "/images/ysl-y-edp.jpg"));
            products.add(buildProduct("Terre d Hermes", "Hermes", "Designer", "Hương gỗ cay nồng", new BigDecimal("2900000"), "MEN", "EDT", "/images/terre-d-hermes.png"));
            products.add(buildProduct("Versace Eros", "Versace", "Designer", "Tình yêu và đam mê", new BigDecimal("2200000"), "MEN", "EDT", "/images/versace-eros.jpg"));
            products.add(buildProduct("Jo Malone Wood Sage", "Jo Malone", "Niche", "Hương muối biển và xô thơm", new BigDecimal("4200000"), "UNISEX", "Cologne", "/images/jo-malone-wood-sage.jpg"));
            products.add(buildProduct("Kilian Angels Share", "Kilian", "Niche", "Hương rượu cognac say đắm", new BigDecimal("7500000"), "UNISEX", "EDP", "/images/kilian-angels-share.jpg"));
            products.add(buildProduct("Mancera Cedrat Boise", "Mancera", "Niche", "Hương chanh và gỗ tuyết tùng", new BigDecimal("3200000"), "UNISEX", "EDP", "/images/mancera-cedrat-boise.jpg"));
            products.add(buildProduct("Montale Intense Cafe", "Montale", "Niche", "Hương cà phê và hoa hồng", new BigDecimal("3000000"), "UNISEX", "EDP", "/images/montale-intense-cafe.jpg"));
            products.add(buildProduct("Parfums de Marly Layton", "Parfums de Marly", "Niche", "Hương táo và vanilla", new BigDecimal("6500000"), "MEN", "EDP", "/images/parfums-de-marly-layton.png"));
            products.add(buildProduct("Roja Elysium", "Roja Dove", "Niche", "Hương cam chanh tươi mát", new BigDecimal("9500000"), "MEN", "Parfum", "/images/roja-elysium.jpg"));
            products.add(buildProduct("Byredo Gypsy Water", "Byredo", "Niche", "Hương gỗ và chanh", new BigDecimal("4800000"), "UNISEX", "EDP", "/images/byredo-gypsy-water.jpg"));
            products.add(buildProduct("Diptyque Tam Dao", "Diptyque", "Niche", "Hương gỗ đàn hương", new BigDecimal("4800000"), "UNISEX", "EDP", "/images/diptyque-tam-dao.jpg"));
            products.add(buildProduct("Maison Margiela Jazz Club", "Maison Margiela", "Designer", "Không khí câu lạc bộ Jazz", new BigDecimal("3500000"), "MEN", "EDT", "/images/maison-margiela-jazz-club.png"));
            products.add(buildProduct("Tom Ford Tobacco Vanille", "Tom Ford", "Designer", "Thuốc lá và vanilla", new BigDecimal("7800000"), "UNISEX", "EDP", "/images/tom-ford-tobacco-vanille.png"));
            products.add(buildProduct("Chanel Coco Mademoiselle", "Chanel", "Designer", "Nữ tính, quyến rũ", new BigDecimal("4200000"), "WOMEN", "EDP", "/images/chanel-coco-mademoiselle.jpg"));
            products.add(buildProduct("Dior J adore", "Dior", "Designer", "Hương hoa cỏ rực rỡ", new BigDecimal("3800000"), "WOMEN", "EDP", "/images/dior-jadore.jpg"));
            products.add(buildProduct("Lancome La Vie Est Belle", "Lancome", "Designer", "Cuộc sống tươi đẹp", new BigDecimal("2800000"), "WOMEN", "EDP", "/images/lancome-la-vie-est-belle.jpg"));
            products.add(buildProduct("Gucci Bloom", "Gucci", "Designer", "Vườn hoa rực rỡ", new BigDecimal("3100000"), "WOMEN", "EDP", "/images/gucci-bloom.jpg"));
            products.add(buildProduct("Marc Jacobs Daisy", "Marc Jacobs", "Designer", "Ngọt ngào, dễ thương", new BigDecimal("2500000"), "WOMEN", "EDT", "/images/marc-jacobs-daisy.jpg"));

            productRepository.saveAll(products);
            log.info("Seeded {} products to PostgreSQL successfully!", products.size());
        } else {
            log.info("Database already has {} products, skipping seed.", productRepository.count());
        }
    }

    private Product buildProduct(String name, String brand, String category, String description,
                                  BigDecimal price, String gender, String concentration, String imageUrl) {
        return Product.builder()
                .name(name)
                .brand(brand)
                .category(category)
                .description(description)
                .basePrice(price)
                .gender(gender)
                .concentration(concentration)
                .imageUrl(imageUrl)
                .status(ProductStatus.ACTIVE)
                .build();
    }
}
