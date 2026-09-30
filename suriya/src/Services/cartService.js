package com.savordine.backend.service;

import com.savordine.backend.model.Cart;
import com.savordine.backend.model.CartItem;
import com.savordine.backend.model.Food;
import com.savordine.backend.model.User;
import com.savordine.backend.repository.CartItemRepository;
import com.savordine.backend.repository.CartRepository;
import com.savordine.backend.repository.FoodRepository;
import com.savordine.backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final FoodRepository foodRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            UserRepository userRepository,
            FoodRepository foodRepository) {

        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.foodRepository = foodRepository;
    }

    // =========================
    // GET OR CREATE CART
    // =========================
    public Cart getOrCreateCart(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(new Cart(user)));
    }

    // =========================
    // GET CART ITEMS
    // =========================
    public List<CartItem> getCartItems(Long userId) {

        Cart cart = getOrCreateCart(userId);

        return cartItemRepository.findByCartId(cart.getId());
    }

    // =========================
    // ADD TO CART
    // =========================
    @Transactional
    public CartItem addToCart(
            Long userId,
            Long foodId,
            Integer quantity) {

        Cart cart = getOrCreateCart(userId);

        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food not found"));

        if (!food.isAvailable()) {
            throw new RuntimeException("Food is not available");
        }

        CartItem cartItem = cartItemRepository
                .findByCartIdAndFoodId(
                        cart.getId(),
                        foodId
                )
                .orElse(null);

        if (cartItem != null) {

            cartItem.setQuantity(
                    cartItem.getQuantity() + quantity
            );

        } else {

            cartItem = new CartItem(
                    cart,
                    food,
                    quantity
            );
        }

        return cartItemRepository.save(cartItem);
    }

    // =========================
    // UPDATE QUANTITY
    // =========================
    @Transactional
    public CartItem updateQuantity(
            Long userId,
            Long foodId,
            Integer quantity) {

        Cart cart = getOrCreateCart(userId);

        CartItem cartItem = cartItemRepository
                .findByCartIdAndFoodId(
                        cart.getId(),
                        foodId
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "Cart item not found"
                        )
                );

        if (quantity <= 0) {

            cartItemRepository.delete(cartItem);

            return null;
        }

        cartItem.setQuantity(quantity);

        return cartItemRepository.save(cartItem);
    }

    // =========================
    // REMOVE SINGLE ITEM
    // =========================
    @Transactional
    public void removeFromCart(
            Long userId,
            Long foodId) {

        Cart cart = getOrCreateCart(userId);

        List<CartItem> items =
                cartItemRepository.findByCartId(cart.getId());

        items.removeIf(item ->
                item.getFood() == null ||
                !item.getFood().getId().equals(foodId)
        );

        cartItemRepository.deleteAll(items);
    }

    // =========================
    // CLEAR ENTIRE CART
    // =========================
    @Transactional
    public void clearCart(Long userId) {

        Cart cart = getOrCreateCart(userId);

        List<CartItem> items =
                cartItemRepository.findByCartId(cart.getId());

        cartItemRepository.deleteAll(items);
    }
}
