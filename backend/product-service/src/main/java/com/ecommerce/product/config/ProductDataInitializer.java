package com.ecommerce.product.config;

import com.ecommerce.common.enums.ProductStatus;
import com.ecommerce.product.entity.Brand;
import com.ecommerce.product.entity.Category;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductVariant;
import com.ecommerce.product.repository.BrandRepository;
import com.ecommerce.product.repository.CategoryRepository;
import com.ecommerce.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProductDataInitializer implements CommandLineRunner {

    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (brandRepository.count() == 0) {
            initBrands();
        }
        if (categoryRepository.count() == 0) {
            initCategories();
        }
        if (productRepository.count() == 0) {
            initProducts();
        }
    }

    private void initBrands() {
        brandRepository.save(Brand.builder().name("Dior").country("France").description("Thương hiệu xa xỉ từ Pháp").active(true).build());
        brandRepository.save(Brand.builder().name("Chanel").country("France").description("Đẳng cấp nước hoa huyền thoại").active(true).build());
        brandRepository.save(Brand.builder().name("Tom Ford").country("USA").description("Nước hoa Niche quyến rũ").active(true).build());
        brandRepository.save(Brand.builder().name("Creed").country("France").description("Hoàng gia Anh và quý tộc").active(true).build());
        brandRepository.save(Brand.builder().name("YSL").country("France").description("Yves Saint Laurent Paris").active(true).build());
        brandRepository.save(Brand.builder().name("Le Labo").country("USA").description("Nước hoa thủ công Niche").active(true).build());
    }

    private void initCategories() {
        categoryRepository.save(Category.builder().name("Nước hoa Nam").slug("nuoc-hoa-nam").description("Dành cho quý ông lịch lãm").active(true).build());
        categoryRepository.save(Category.builder().name("Nước hoa Nữ").slug("nuoc-hoa-nu").description("Dành cho quý cô thanh lịch").active(true).build());
        categoryRepository.save(Category.builder().name("Nước hoa Unisex").slug("nuoc-hoa-unisex").description("Phong cách phi giới tính cá tính").active(true).build());
        categoryRepository.save(Category.builder().name("Nước hoa Niche").slug("nuoc-hoa-niche").description("Dòng nước hoa thủ công độc bản").active(true).build());
    }

    private void initProducts() {
        // 1. Dior Sauvage Eau de Parfum
        Product p1 = Product.builder()
                .name("Dior Sauvage Eau de Parfum")
                .brand("Dior")
                .category("Nước hoa Nam")
                .description("Hương thơm tươi mát đầy nam tính mở đầu với cam Bergamot vùng Calabria, kế đến là tiêu cay nồng và hương vani Papua New Guinea ngọt ngào, ấm áp khó cưỡng.")
                .gender("MEN")
                .concentration("EDP")
                .fragranceFamily("Oriental Fougere")
                .topNotes("Cam Bergamot Calabria, Tiêu Tứ Xuyên")
                .middleNotes("Hoa oải hương, Đại hồi, Nhục đậu khấu")
                .baseNotes("Nhựa Ambroxan, Hương Vani Vanilla")
                .basePrice(new BigDecimal("3200000"))
                .promotionalPrice(new BigDecimal("2950000"))
                .imageUrl("https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600")
                .images(List.of(
                        "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600",
                        "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600"
                ))
                .rating(4.9)
                .totalReviews(28)
                .soldCount(145)
                .status(ProductStatus.ACTIVE)
                .variants(new ArrayList<>())
                .build();

        p1.addVariant(ProductVariant.builder().variantName("60ml").volume("60ml").price(new BigDecimal("3200000")).promotionalPrice(new BigDecimal("2950000")).sku("DIOR-SAUVAGE-60ML").active(true).build());
        p1.addVariant(ProductVariant.builder().variantName("100ml").volume("100ml").price(new BigDecimal("4100000")).promotionalPrice(new BigDecimal("3850000")).sku("DIOR-SAUVAGE-100ML").active(true).build());
        productRepository.save(p1);

        // 2. Bleu de Chanel Eau de Parfum
        Product p2 = Product.builder()
                .name("Bleu de Chanel Eau de Parfum")
                .brand("Chanel")
                .category("Nước hoa Nam")
                .description("Một mùi hương gỗ thơm nồng nàn với sự tươi mát của bưởi chùm, bạc hà hòa quyện cùng gỗ tuyết tùng và hương trầm ấm bí ẩn.")
                .gender("MEN")
                .concentration("EDP")
                .fragranceFamily("Woody Aromatic")
                .topNotes("Bưởi chùm, Chanh vàng, Bạc hà, Tiêu hồng")
                .middleNotes("Gừng, Nhục đậu khấu, Hoa nhài")
                .baseNotes("Hương trầm Incense, Gỗ tuyết tùng Cedar, Gỗ đàn hương")
                .basePrice(new BigDecimal("3900000"))
                .promotionalPrice(new BigDecimal("3650000"))
                .imageUrl("https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600")
                .images(List.of(
                        "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600"
                ))
                .rating(4.8)
                .totalReviews(35)
                .soldCount(210)
                .status(ProductStatus.ACTIVE)
                .variants(new ArrayList<>())
                .build();

        p2.addVariant(ProductVariant.builder().variantName("50ml").volume("50ml").price(new BigDecimal("3900000")).promotionalPrice(new BigDecimal("3650000")).sku("CHANEL-BLEU-50ML").active(true).build());
        p2.addVariant(ProductVariant.builder().variantName("100ml").volume("100ml").price(new BigDecimal("4900000")).promotionalPrice(new BigDecimal("4600000")).sku("CHANEL-BLEU-100ML").active(true).build());
        productRepository.save(p2);

        // 3. Tom Ford Black Orchid
        Product p3 = Product.builder()
                .name("Tom Ford Black Orchid")
                .brand("Tom Ford")
                .category("Nước hoa Unisex")
                .description("Mùi hương sang trọng, quyến rũ và bí ẩn bậc nhất thế giới nước hoa với sự phối hợp độc đáo của phong lan đen, nấm truffle và chocolate đậm đà.")
                .gender("UNISEX")
                .concentration("EDP")
                .fragranceFamily("Oriental Floral")
                .topNotes("Nấm Truffle đen, Hoa sơn chi, Quả lý chua đen, Cam Bergamot")
                .middleNotes("Hoa phong lan đen Orchid, Gia vị cay, Hoa sen")
                .baseNotes("Chocolate Mexico, Hoắc hương Patchouli, Hương Vani, Hổ phách")
                .basePrice(new BigDecimal("4200000"))
                .imageUrl("https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600")
                .images(List.of("https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600"))
                .rating(5.0)
                .totalReviews(18)
                .soldCount(90)
                .status(ProductStatus.ACTIVE)
                .variants(new ArrayList<>())
                .build();

        p3.addVariant(ProductVariant.builder().variantName("50ml").volume("50ml").price(new BigDecimal("4200000")).sku("TF-BLACKORCHID-50ML").active(true).build());
        p3.addVariant(ProductVariant.builder().variantName("100ml").volume("100ml").price(new BigDecimal("5600000")).sku("TF-BLACKORCHID-100ML").active(true).build());
        productRepository.save(p3);

        // 4. YSL Libre Eau de Parfum
        Product p4 = Product.builder()
                .name("YSL Libre Eau de Parfum")
                .brand("YSL")
                .category("Nước hoa Nữ")
                .description("Biểu tượng của sự tự do với sự kết hợp tương phản giữa hoa oải hương Pháp quý phái và hoa cam Morocco rực rỡ ngọt ngào.")
                .gender("WOMEN")
                .concentration("EDP")
                .fragranceFamily("Floral Fougere")
                .topNotes("Hoa oải hương Lavender, Quả quýt Mandarin, Lý chua đen")
                .middleNotes("Hoa cam Morocco Orange Blossom, Hoa nhài Sambac")
                .baseNotes("Vani Madagascar Vanilla, Gỗ tuyết tùng, Xạ hương")
                .basePrice(new BigDecimal("3450000"))
                .promotionalPrice(new BigDecimal("3150000"))
                .imageUrl("https://images.unsplash.com/photo-1541643600914-78b084683601?w=600")
                .images(List.of("https://images.unsplash.com/photo-1541643600914-78b084683601?w=600"))
                .rating(4.9)
                .totalReviews(42)
                .soldCount(320)
                .status(ProductStatus.ACTIVE)
                .variants(new ArrayList<>())
                .build();

        p4.addVariant(ProductVariant.builder().variantName("50ml").volume("50ml").price(new BigDecimal("3450000")).promotionalPrice(new BigDecimal("3150000")).sku("YSL-LIBRE-50ML").active(true).build());
        p4.addVariant(ProductVariant.builder().variantName("90ml").volume("90ml").price(new BigDecimal("4300000")).promotionalPrice(new BigDecimal("3950000")).sku("YSL-LIBRE-90ML").active(true).build());
        productRepository.save(p4);

        // 5. Le Labo Santal 33
        Product p5 = Product.builder()
                .name("Le Labo Santal 33")
                .brand("Le Labo")
                .category("Nước hoa Niche")
                .description("Mùi hương khói và gỗ đàn hương kinh điển mang phong cách nghệ thuật, thảo mộc phương Tây và da thuộc thượng hạng.")
                .gender("UNISEX")
                .concentration("Parfum")
                .fragranceFamily("Woody Aromatic")
                .topNotes("Bạch đậu khấu Cardamom, Hoa diên vĩ Iris, Hoa violet")
                .middleNotes("Hổ phách, Giấy cói Papyrus")
                .baseNotes("Gỗ đàn hương Sandalwood, Gỗ tuyết tùng, Da thuộc Leather")
                .basePrice(new BigDecimal("6500000"))
                .imageUrl("https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600")
                .images(List.of("https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600"))
                .rating(4.9)
                .totalReviews(50)
                .soldCount(180)
                .status(ProductStatus.ACTIVE)
                .variants(new ArrayList<>())
                .build();

        p5.addVariant(ProductVariant.builder().variantName("50ml").volume("50ml").price(new BigDecimal("6500000")).sku("LELABO-SANTAL33-50ML").active(true).build());
        p5.addVariant(ProductVariant.builder().variantName("100ml").volume("100ml").price(new BigDecimal("8800000")).sku("LELABO-SANTAL33-100ML").active(true).build());
        productRepository.save(p5);
    }
}
